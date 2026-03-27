package com.klu.mail;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
	
	@Autowired
	private JavaMailSender sender;
	
	@Autowired
	private UserSignUpRepository repo;
	
	public String generateOpt(String name,String toMail,String password) {
		
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

	public String VerifyOtp(String mail,int recOtp) {
		
		UserSignUp recMail = repo.findByMail(mail).orElseThrow(() -> new RuntimeException("Mail Not Found"));
		LocalDateTime time = recMail.getOtpTimeOut();
		LocalDateTime verifyTime = LocalDateTime.now();
		
		if(time.plusMinutes(3).isBefore(verifyTime)) {
			return "Otp Request TimeOut";
		}
		
		if(recMail.getOtp()==recOtp) {
			recMail.setVerified(true);
			repo.save(recMail);
			return "Verified You Can SignIn Now";
		}
		
		return "Invalid Otp";
	}
	
	public String login(Login req) {
		UserSignUp recMail = repo.findByMail(req.getMail()).orElseThrow(() -> new RuntimeException("Mail Not Found"));
		
		if (!recMail.getMail().endsWith("@kluniversity.in")) {
		    return "Use valid university email";
		}
		if (!recMail.isVerified()) {
	        return "Please verify email first";
	    }
		if(!recMail.getPassword().equals(req.getPassword())) {
			return "Incorrect PassWord";
		}
		return "Welcome To DashBoard";
	}

	public String reSend(String mail) {
		
		UserSignUp recMail = repo.findByMail(mail).orElseThrow(() -> new RuntimeException("Mail Not Found"));
		
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
