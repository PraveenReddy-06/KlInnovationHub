package com.klu.mail;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.klu.dto.LoginRequestDto;
import com.klu.model.Student;
import com.klu.repository.StudentRepo;
import com.klu.service.implementation.StudentImple;

@Service
public class MailService {
	
	@Autowired
	private JavaMailSender sender;
	
	@Autowired
	private UserSignUpRepository repo;
	
	@Autowired
	private StudentImple studentService;
	
	@Autowired
	private StudentRepo studentRepo;
	
	public String generateOtp(String name,String toMail,String password) {
		
		if (!toMail.endsWith("@kluniversity.in")) {
		    return "Use Kl University email";
		}
		
		Optional<UserSignUp> existingUser = repo.findByMail(toMail);

		if (existingUser.isPresent() && existingUser.get().isVerified()) {
		    return "User already exists. Please login.";
		}
		
		int otpnum = (int)( Math.random()*9000)+1000;
		
		SimpleMailMessage msg = new SimpleMailMessage();
		msg.setTo(toMail);
		msg.setSubject("Otp From SpringBoot");
		msg.setText("Your Otp is "+otpnum);
		
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
		user.setPassword(password);
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
	        repo.save(recMail);
	        return "Verified You Can SignIn Now";
	    }catch(RuntimeException e) {
	        return e.getMessage();
	    }
	}
	
	public LoginRequestDto login(Login req) {
		UserSignUp recMail = repo.findByMail(req.getMail()).orElse(null);
		
		if(recMail==null) {
			return new LoginRequestDto("Mail Not Found",null,null,null);
		}
		
		if (!recMail.getMail().endsWith("@kluniversity.in")) {
			
		    return new LoginRequestDto("Use valid university email",null,null,null);
		}
		if (!recMail.isVerified()) {
	        return new LoginRequestDto("Please verify email first",null,null,null);
	    }
		if(!recMail.getPassword().equals(req.getPassword())) {
			return new LoginRequestDto("Incorrect PassWord",null,null,null);
		}
		
		Student s = studentRepo.findByStudentEmail(recMail.getMail());
		return new LoginRequestDto("Welcome To DashBoard",s,s.getStudentId(),s.getStudentEmail());
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
			
		int otpnum = (int)( Math.random()*9000)+1000;
		
		SimpleMailMessage msg = new SimpleMailMessage();
		msg.setTo(mail);
		msg.setSubject("Otp From SpringBoot");
		msg.setText("Your Otp is "+otpnum);
	
		sender.send(msg);
		
		recMail.setOtp(otpnum);
		recMail.setOtpTimeOut(LocalDateTime.now());
		repo.save(recMail);
		
		return "Check your inbox for otp";
	}
}
