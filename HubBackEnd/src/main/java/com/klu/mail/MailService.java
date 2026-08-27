package com.klu.mail;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.klu.dto.LoginRequestDto;
import com.klu.model.Student;
import com.klu.repository.StudentRepo;
import com.klu.security.JwtService;
import com.klu.security.ratelimit.LoginRateLimiterService;
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
	private LoginRateLimiterService loginRateLimiterService;
	
	@Autowired JwtService jwtService;
	
	private final SecureRandom secureRandom = new SecureRandom();
	private static final String PASSWORD_REGEX ="^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,64}$";

    MailService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
	
	public String generateOtp(String name,String toMail,String password) {
		if (!toMail.matches("\\d{10}@kluniversity\\.in")){
		    return "Use Kl University email";
		}
		Optional<UserSignUp> existingUser = repo.findByMail(toMail);

		if (existingUser.isPresent() && existingUser.get().isVerified()) {
		    return "User already exists. Please login.";
		}
		if(!password.matches(PASSWORD_REGEX)) {
		    return "Password does not meet security requirements";
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
		sender.send(msg);
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
		user.setVerified(false);
		repo.save(user);		
		return "If the email exists, OTP has been sent";
	}

	public String verifyOtp(String mail,int recOtp) {
	    UserSignUp recMail = repo.findByMail(mail).orElseThrow(() -> new RuntimeException("Mail Not Found")); 
	    LocalDateTime time = recMail.getOtpTimeOut();
	    if(time.plusMinutes(3).isBefore(LocalDateTime.now())) {
	        return "Otp Request TimeOut";
	    }
	    if(recMail.getOtp() != recOtp) {
	        return "Invalid Otp";
	    }
	    try {
	        studentService.CreateStudentByEmail(recMail.getMail(),recMail.getName());
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
		
		UserSignUp recMail = repo.findByMail(req.getMail()).orElse(null);
		if (loginRateLimiterService.isBlocked(req.getMail())) {
		    long minutes =loginRateLimiterService.getRemainingLockMinutes(req.getMail());
		    return new LoginRequestDto("Too many failed login attempts. Try again in " + minutes + " minute(s).", null,null, null,null);
		}
		
		if(recMail==null) {
			return new LoginRequestDto("Mail Not Found",null,null,null,null);
		}
		
		if (!recMail.getMail().endsWith("@kluniversity.in")) {
		    return new LoginRequestDto("Use valid university email",null,null,null,null);
		}
		
		if (!recMail.isVerified()) {
	        return new LoginRequestDto("Please verify email first",null,null,null,null);
	    }
		
		String token=null;
		try {
			Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getMail(),req.getPassword()));
			token = jwtService.generateToken(auth.getName());
			loginRateLimiterService.loginSucceeded(req.getMail());
		}catch (BadCredentialsException e) {
			loginRateLimiterService.loginFailed(req.getMail());
			return new LoginRequestDto("Bad Credentials",null,null,null,null);
		}
		
		
		Student s = studentRepo.findByStudentEmail(recMail.getMail());
		if(s == null){
			return new LoginRequestDto("Student profile not found",null,null,null,null);
		}
		return new LoginRequestDto("Welcome To DashBoard",s,s.getStudentId(),s.getStudentEmail(),token);
	}

	public String reSend(String mail) {
		
		UserSignUp recMail = repo.findByMail(mail).orElse(null);
		
		if(recMail==null) {
			return "Mail Not Found";
		}
		
		if (!recMail.getMail().endsWith("@kluniversity.in")) {
		    return "Use valid university email";
		}
		if(recMail.isVerified()) {
		    return "User already verified";
		}
		
		LocalDateTime time = recMail.getOtpTimeOut();		
		if(LocalDateTime.now().isBefore(time.plusMinutes(3))) {
		    return "Wait 3 minutes before resending a verification email";
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
	
		sender.send(msg);
		
		recMail.setOtp(otpnum);
		recMail.setOtpTimeOut(LocalDateTime.now());
		repo.save(recMail);
		
		return "Check your inbox for otp";
	}
	
	public String forgotPassword(String mail) {

	    UserSignUp user = repo.findByMail(mail).orElse(null);

	    if(user == null) {
	        return "Mail Not Found";
	    }
	    if(!user.isVerified()) {
	        return "Please verify account first";
	    }

	    int otp = secureRandom.nextInt(9000) + 1000;

	    SimpleMailMessage msg = new SimpleMailMessage();
	    msg.setTo(mail);
		msg.setSubject("Reset Your Password • KL Innovation Hub");

		msg.setText(
			"Hello,\n\n" +

			"We received a request to reset your password.\n\n" +

			"Use the OTP below to continue:\n\n" +

			"━━━━━━━━━━━━━━━━━━━━━━\n" +
			"        OTP : " + otp + "\n" +
			"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

			"This OTP expires in 3 minutes.\n\n" +

			"If you didn't request a password reset, please ignore this email.\n\n" +

			"For your security, never share this OTP.\n\n" +

			"—\n" +
			"KL Innovation Hub\n" +
			"Build • Collaborate • Innovate"
		);

	    sender.send(msg);

	    user.setOtp(otp);
	    user.setOtpTimeOut(LocalDateTime.now());
	    user.setResetOtpVerified(false);

	    repo.save(user);

	    return "OTP Sent";
	}
	
	public String verifyResetOtp(String mail,int otp) {

	    UserSignUp user = repo.findByMail(mail).orElse(null);

	    if(user == null) {
	        return "Mail Not Found";
	    }

	    if(user.getOtpTimeOut().plusMinutes(3).isBefore(LocalDateTime.now())) {
	        return "OTP Expired";
	    }

	    if(user.getOtp() != otp) {
	        return "Invalid OTP";
	    }

	    user.setResetOtpVerified(true);
	    
	    repo.save(user);
	    return "OTP Verified";
	}
	
	public String resetPassword(String mail,String newPassword) {

	    UserSignUp user = repo.findByMail(mail).orElse(null);
	    if(user == null) {
	        return "Mail Not Found";
	    }
	    if(!newPassword.matches(PASSWORD_REGEX)) {
	        return "Password does not meet security requirements";
	    }

	    if(!user.isResetOtpVerified()) {
	        return "Verify OTP First";
	    }

	    user.setPassword(passwordEncoder.encode(newPassword));
	    user.setOtp(0);
	    user.setResetOtpVerified(false);
	    user.setOtpTimeOut(null);
	    repo.save(user);
	    return "Password Updated Successfully";
	}
}
