package com.klu.mail;
import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import com.klu.dto.LoginRequestDto;
import com.klu.model.Student;
import com.klu.repository.StudentRepo;
import com.klu.security.JwtService;
import com.klu.security.ratelimit.AuthRateLimiter;
import com.klu.security.ratelimit.AuthRateLimiter.Action;
import com.klu.service.implementation.StudentImple;

@Service
public class MailService {

    private final AuthenticationManager authenticationManager;
	
	@Autowired
	private JavaMailSender sender;
	
	@Autowired
	private UserSignUpRepository repo;
	
	@Autowired
	private StudentImple studentService;
	
	@Autowired
	private StudentRepo studentRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private AuthRateLimiter limiter;

	@Autowired JwtService jwtService;
	
	private final SecureRandom secureRandom = new SecureRandom();
	private static final String PASSWORD_REGEX ="^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,64}$";
	private static final java.util.Set<String> STUDENT_DOMAINS = java.util.Set.of(
			"AI/ML", "Data Science", "Web Development", "Mobile App Development", "Cloud Computing",
			"Cybersecurity", "Internet of Things (IoT)", "Robotics", "Embedded Systems", "Blockchain",
			"Computer Vision", "Natural Language Processing (NLP)", "DevOps", "AR/VR", "Other");

    MailService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
	
	@Transactional(isolation = Isolation.READ_COMMITTED)
	public String generateOtp(String name,String toMail,String password,String interestedDomain) {
		if (toMail == null || !toMail.matches("\\d{10}@kluniversity\\.in")){
		    return "Use Kl University email";
		}
		Optional<UserSignUp> existingUser = repo.findByMailForUpdate(toMail);

		if (existingUser.isPresent() && (existingUser.get().isVerified()
                || "ROLE_ADMIN".equals(existingUser.get().getRole()))) {
		    return "User already exists. Please login.";
		}
		if (password == null || !password.matches(PASSWORD_REGEX)
                || password.getBytes(StandardCharsets.UTF_8).length > 72) {
		    return "Password does not meet security requirements";
		}
		if (interestedDomain == null || !STUDENT_DOMAINS.contains(interestedDomain)) {
		    return "Select a valid interested domain";
		}
        if (!limiter.acquire(Action.SIGNUP_ISSUE, toMail)) {
            return "Too many verification emails requested. Please try again later.";
        }
		int otpnum = secureRandom.nextInt(9000) + 1000;
		SimpleMailMessage msg = new SimpleMailMessage();
		msg.setTo(toMail);
		msg.setSubject("Verify Your Email • KL Innovation Hub");
		msg.setText(
			"Hello " + name + ",\n\n" +

			"Welcome to KL Innovation Hub!\n\n" +

			"Use the OTP below to verify your email address:\n\n" +

			"━━━━━━━━━━━━━━━━━━━━━━\n" +
			"        OTP : " + otpnum + "\n" +
			"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

			"This OTP is valid for 3 minutes.\n\n" +

			"For your security:\n" +
			"• Never share this OTP with anyone.\n" +

			"If you didn't request this verification, you can safely ignore this email.\n\n" +

			"Happy Building!\n\n" +

			"—\n" +
			"KL Innovation Hub\n" +
			"Build • Collaborate • Innovate"
		);
        try {
            sender.send(msg);
        } catch (MailException deliveryFailure) {
            return "Unable to send OTP. Please try again later.";
        }
		UserSignUp user;
	    if (existingUser.isPresent()) {
	        user = existingUser.get();
	    } else {
	        user = new UserSignUp();
	    }
		user.setOtpTimeOut(LocalDateTime.now());
		user.setName(name);
		user.setMail(toMail);
		user.setOtp(otpnum);
		user.setPassword(passwordEncoder.encode(password));
		user.setRole("ROLE_STUDENT");
		user.setInterestedDomain(interestedDomain);
		user.setVerified(false);
		repo.save(user);		
		return "If the email exists, OTP has been sent";
	}

	@Transactional
	public String verifyOtp(String mail, int recOtp) {
	    UserSignUp recMail = repo.findByMailForUpdate(mail).orElse(null);
	    if (recMail == null || recMail.isVerified() || !"ROLE_STUDENT".equals(recMail.getRole())) {
	        return "Invalid or expired OTP";
	    }
	    LocalDateTime time = recMail.getOtpTimeOut();
	    if (time == null || !time.plusMinutes(3).isAfter(LocalDateTime.now())) {
	        return "Otp Request TimeOut";
	    }
	    if (!limiter.acquire(Action.SIGNUP_VERIFY, recMail.getId() + ":" + time)) {
	        return "Too many OTP attempts. Request a new OTP.";
	    }
	    if (recMail.getOtp() != recOtp) {
	        return "Invalid Otp";
	    }
	    try {
	        studentService.CreateStudentByEmail(recMail.getMail(),recMail.getName(),recMail.getInterestedDomain());
	        recMail.setVerified(true);
	        recMail.setOtp(0);
	        recMail.setOtpTimeOut(null);
	        repo.save(recMail);
	        return "Verified You Can SignIn Now";
	    }catch(RuntimeException e) {
	        return e.getMessage();
	    }
	}
	
	public LoginRequestDto login(Login req) {
		
        if (req.getMail() == null || req.getPassword() == null) {
            return new LoginRequestDto("Email and password are required", null, null, null, null);
        }
		UserSignUp recMail = repo.findByMail(req.getMail().strip()).orElse(null);
		
		if(recMail==null) {
			return new LoginRequestDto("Mail Not Found",null,null,null,null);
		}
		
		if (!"ROLE_STUDENT".equals(recMail.getRole()) || !recMail.getMail().endsWith("@kluniversity.in")) {
		    return new LoginRequestDto("Use valid university email",null,null,null,null);
		}
		
		if (!recMail.isVerified()) {
	        return new LoginRequestDto("Please verify email first",null,null,null,null);
	    }
		
        if (!limiter.acquire(Action.LOGIN, recMail.getMail())) {
            return new LoginRequestDto(AuthRateLimiter.LOGIN_LIMIT_MESSAGE, null, null, null, null);
        }
		String token;
		try {
			Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(recMail.getMail(),req.getPassword()));
			token = jwtService.generateToken(auth);
			limiter.clearLogin(recMail.getMail());
		}catch (BadCredentialsException e) {
			return new LoginRequestDto("Bad Credentials",null,null,null,null);
		}
		
		
		Student s = studentRepo.findByStudentEmail(recMail.getMail());
		if(s == null){
			return new LoginRequestDto("Student profile not found",null,null,null,null);
		}
		return new LoginRequestDto("Welcome To DashBoard",s,s.getStudentId(),s.getStudentEmail(),token);
	}

	@Transactional
	public String reSend(String mail) {
		
		UserSignUp recMail = repo.findByMailForUpdate(mail).orElse(null);
		
		if(recMail==null) {
			return "Mail Not Found";
		}
		
		if (!"ROLE_STUDENT".equals(recMail.getRole()) || !recMail.getMail().endsWith("@kluniversity.in")) {
		    return "Use valid university email";
		}
		if(recMail.isVerified()) {
		    return "User already verified";
		}
		
		LocalDateTime time = recMail.getOtpTimeOut();		
		if (time != null && LocalDateTime.now().isBefore(time.plusMinutes(3))) {
		    return "Wait 3 minutes before resending a verification email";
		}
			
        if (!limiter.acquire(Action.SIGNUP_ISSUE, recMail.getMail())) {
            return "Too many verification emails requested. Please try again later.";
        }
		int otpnum = secureRandom.nextInt(9000) + 1000;
		
		SimpleMailMessage msg = new SimpleMailMessage();
		msg.setTo(mail);
		msg.setSubject("Your New Verification Code • KL Innovation Hub");
		msg.setText(
			"Hello,\n\n" +

			"Here is your new verification code.\n\n" +

			"━━━━━━━━━━━━━━━━━━━━━━\n" +
			"        OTP : " + otpnum + "\n" +
			"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

			"This OTP is valid for 3 minutes.\n\n" +

			"Your previous OTP is no longer valid.\n\n" +

			"If you didn't request this email, you can ignore it.\n\n" +

			"—\n" +
			"KL Innovation Hub"
		);
	
        try {
            sender.send(msg);
        } catch (MailException deliveryFailure) {
            return "Unable to send OTP. Please try again later.";
        }
		
		recMail.setOtp(otpnum);
		recMail.setOtpTimeOut(LocalDateTime.now());
		repo.save(recMail);
		
		return "Check your inbox for otp";
	}
}
