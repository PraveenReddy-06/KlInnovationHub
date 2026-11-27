package com.klu.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.klu.mail.UserSignUp;
import com.klu.mail.UserSignUpRepository;
import com.klu.model.Reviewer;
import com.klu.model.Student;
import com.klu.repository.ReviewerRepo;
import com.klu.repository.ReviewerRequestRepo;
import com.klu.repository.StudentRepo;
import com.klu.security.ratelimit.AuthRateLimiter;
import com.klu.security.ratelimit.AuthRateLimiter.Action;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthenticationSecurityTest {

    private static final String PASSWORD = "FixturePassword1!";
    private static final String NEW_PASSWORD = "FixtureUpdated2!";
    private static final String ADMIN_EMAIL = "fixture-admin@example.test";
    private static final byte[] RFC_KEY = "12345678901234567890".getBytes(StandardCharsets.US_ASCII);

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper json;
    @Autowired private UserSignUpRepository users;
    @Autowired private StudentRepo students;
    @Autowired private ReviewerRepo reviewers;
    @Autowired private ReviewerRequestRepo reviewerRequests;
    @Autowired private PasswordEncoder encoder;
    @Autowired private AuthRateLimiter limiter;
    @Autowired private JwtService jwt;
    @MockitoBean private JavaMailSender mail;

    @DynamicPropertySource
    static void rfcExampleEnrollment(DynamicPropertyRegistry properties) {
        properties.add("admin.mfa.totp-secret", () -> "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ");
    }

    @Test
    void studentResetConsumesProofAndRevokesExistingSession() throws Exception {
        String email = "2000000101@kluniversity.in";
        account(email, "ROLE_STUDENT", true);
        Student student = new Student();
        student.setStudentId(2000000101L);
        student.setStudentEmail(email);
        students.save(student);

        String oldSession = token("/mail/login", email, PASSWORD);
        allowed("/project/my-pending", oldSession);
        String proof = recoveryProof("/mail", email);
        assertFalse(body(resetPassword("/mail", email, "a".repeat(43))).equals("Password Updated Successfully"));
        assertEquals("Password Updated Successfully", body(resetPassword("/mail", email, proof)));
        assertFalse(body(resetPassword("/mail", email, proof)).equals("Password Updated Successfully"));

        mvc.perform(get("/project/my-pending").header("Authorization", "Bearer " + oldSession))
                .andExpect(status().isUnauthorized());
        assertTrue(login("/mail/login", email, PASSWORD).path("token").isNull());
        allowed("/project/my-pending", token("/mail/login", email, NEW_PASSWORD));
    }

    @Test
    void facultyRecoveryUsesTheFacultyRouteAndRejectsExpiredProof() throws Exception {
        String email = "fixture.faculty@kluniversity.in";
        UserSignUp faculty = account(email, "ROLE_REVIEWER", true);
        Reviewer reviewer = new Reviewer();
        reviewer.setUser(faculty);
        reviewers.save(reviewer);

        String oldSession = token("/reviewer/login", email, PASSWORD);
        allowed("/reviewer/projects/pending", oldSession);
        requestRecovery("/mail", email);
        verifyNoInteractions(mail);
        String proof = recoveryProof("/reviewer", email);
        assertFalse(body(resetPassword("/mail", email, proof)).equals("Password Updated Successfully"));

        faculty = users.findByMail(email).orElseThrow();
        faculty.setPasswordResetTokenExpiresAt(Instant.now().minusSeconds(1));
        users.saveAndFlush(faculty);
        assertFalse(body(resetPassword("/reviewer", email, proof)).equals("Password Updated Successfully"));
        allowed("/reviewer/projects/pending", oldSession);
    }

    @Test
    void otpIssuanceAndVerificationAreLimitedWithoutBreakingSignup() throws Exception {
        String student = "2600030102@kluniversity.in";
        Map<String, String> studentForm = Map.of("mail", student, "name", "Test Student",
                "password", PASSWORD, "interestedDomain", "Web Development");
        body(postJson("/mail/generateOtp", studentForm));
        int studentCode = sentCode();
        postJson("/mail/generateOtp", studentForm).andExpect(status().isTooManyRequests());
        assertEquals("Verified You Can SignIn Now", body(postJson("/mail/verifyOtp",
                Map.of("mail", student, "otp", studentCode))));
        assertTrue(students.existsById(2600030102L));

        reset(mail);
        String faculty = "signup.faculty@kluniversity.in";
        Map<String, String> application = Map.of("mail", faculty, "name", "Test Faculty", "password", PASSWORD,
                "department", "CSE", "designation", "Faculty", "reason", "Test application",
                "choice1", "AI/ML", "choice2", "Data Science", "choice3", "Web Development");
        body(postJson("/reviewer/generateOtp", application));
        int facultyCode = sentCode();
        var verify = new java.util.HashMap<String, Object>(application);
        verify.remove("password");
        verify.put("otp", facultyCode == 1000 ? 1001 : 1000);
        for (int i = 0; i < 5; i++) {
            assertEquals("Invalid OTP", body(postJson("/reviewer/verifyOtp", verify)));
        }
        verify.put("otp", facultyCode);
        postJson("/reviewer/verifyOtp", verify).andExpect(status().isTooManyRequests());
        assertFalse(users.findByMail(faculty).orElseThrow().isVerified());

        reset(mail);
        String freshFaculty = "fresh.faculty@kluniversity.in";
        var fresh = new java.util.HashMap<>(application);
        fresh.put("mail", freshFaculty);
        body(postJson("/reviewer/generateOtp", fresh));
        verify.put("mail", freshFaculty);
        verify.put("otp", sentCode());
        assertTrue(body(postJson("/reviewer/verifyOtp", verify)).contains("pending admin approval"));
        assertTrue(reviewerRequests.findTopByUserIdOrderByCreatedAtDesc(
                users.findByMail(freshFaculty).orElseThrow().getId()).isPresent());
    }

    @Test
    void adminRequiresMfaAndCannotReuseAnAuthenticatorCode() throws Exception {
        var user = account(ADMIN_EMAIL, "ROLE_ADMIN", true);
        var principal = new AccountPrincipal(user);
        String passwordOnly = jwt.generateToken(new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities()));
        mvc.perform(get("/admin/reviewers/requests").header("Authorization", "Bearer " + passwordOnly))
                .andExpect(status().isUnauthorized());

        for (int i = 0; i < 5; i++) {
            assertTrue(login("/admin/login", ADMIN_EMAIL, PASSWORD).path("token").isNull());
        }
        postJson("/admin/login", Map.of("mail", ADMIN_EMAIL, "password", PASSWORD))
                .andExpect(status().isTooManyRequests());
        limiter.clearLogin(ADMIN_EMAIL);

        String code = new String(AdminTotp.codeAt(RFC_KEY, Instant.now().getEpochSecond() / 30),
                StandardCharsets.US_ASCII);
        Map<String, String> form = Map.of("mail", ADMIN_EMAIL, "password", PASSWORD, "authenticatorCode", code);
        String adminToken = jsonBody(postJson("/admin/login", form)).path("token").asText(null);
        assertTrue(adminToken != null && !adminToken.isBlank());
        allowed("/admin/reviewers/requests", adminToken);
        assertTrue(jsonBody(postJson("/admin/login", form)).path("token").isNull());
    }

    @Test
    void sharedDatabaseSerializesConcurrentRateLimitReservations() throws Exception {
        var executor = Executors.newFixedThreadPool(8);
        var ready = new CountDownLatch(8);
        var start = new CountDownLatch(1);
        try {
            var requests = IntStream.range(0, 8).mapToObj(i -> executor.submit(() -> {
                ready.countDown();
                assertTrue(start.await(5, TimeUnit.SECONDS));
                String email = i % 2 == 0 ? "CONCURRENT@example.test" : "concurrent@example.test";
                return limiter.acquire(Action.LOGIN, email);
            })).toList();
            assertTrue(ready.await(5, TimeUnit.SECONDS));
            start.countDown();
            int accepted = 0;
            for (var request : requests) {
                if (request.get(10, TimeUnit.SECONDS)) accepted++;
            }
            assertEquals(5, accepted);
        } finally {
            executor.shutdownNow();
        }
    }

    @Test
    void authenticatorCodeMatchesTheRfcTestVector() {
        assertEquals("287082", new String(AdminTotp.codeAt(RFC_KEY, 1), StandardCharsets.US_ASCII));
        assertTrue(AdminTotp.match(RFC_KEY, "287082", Instant.ofEpochSecond(59), null).isPresent());
        assertFalse(AdminTotp.match(RFC_KEY, "287082", Instant.ofEpochSecond(59), 1L).isPresent());
    }

    private UserSignUp account(String email, String role, boolean verified) {
        var user = new UserSignUp();
        user.setMail(email);
        user.setName("Synthetic fixture");
        user.setRole(role);
        user.setVerified(verified);
        user.setPassword(encoder.encode(PASSWORD));
        return users.saveAndFlush(user);
    }

    private int sentCode() {
        ArgumentCaptor<SimpleMailMessage> sent = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mail).send(sent.capture());
        var matcher = Pattern.compile("OTP\\s*(?:is|:)\\s*(\\d{4})").matcher(sent.getValue().getText());
        assertTrue(matcher.find());
        return Integer.parseInt(matcher.group(1));
    }

    private void requestRecovery(String route, String email) throws Exception {
        mvc.perform(post(route + "/forgotPassword").param("mail", email)).andExpect(status().isOk());
    }

    private String recoveryProof(String route, String email) throws Exception {
        requestRecovery(route, email);
        int code = sentCode();
        JsonNode response = jsonBody(postJson(route + "/verifyResetOtp", Map.of("mail", email, "otp", code)));
        assertEquals(43, response.path("resetToken").asText().length());
        assertTrue(jsonBody(postJson(route + "/verifyResetOtp", Map.of("mail", email, "otp", code)))
                .path("resetToken").isNull());
        return response.path("resetToken").asText();
    }

    private ResultActions resetPassword(String route, String email, String proof) throws Exception {
        return postJson(route + "/resetPassword", Map.of("mail", email, "resetToken", proof,
                "newPassword", NEW_PASSWORD));
    }

    private JsonNode login(String route, String email, String password) throws Exception {
        return jsonBody(postJson(route, Map.of("mail", email, "password", password)));
    }

    private String token(String route, String email, String password) throws Exception {
        String token = login(route, email, password).path("token").asText(null);
        assertTrue(token != null && !token.isBlank());
        return token;
    }

    private void allowed(String route, String token) throws Exception {
        mvc.perform(get(route).header("Authorization", "Bearer " + token)).andExpect(status().isOk());
    }

    private ResultActions postJson(String route, Map<String, ?> data) throws Exception {
        return mvc.perform(post(route).contentType("application/json").content(json.writeValueAsString(data)));
    }

    private JsonNode jsonBody(ResultActions response) throws Exception {
        return json.readTree(body(response));
    }

    private static String body(ResultActions response) throws Exception {
        return response.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    }
}
