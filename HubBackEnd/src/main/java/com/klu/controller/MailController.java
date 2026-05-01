package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.SignUpFormDto;
import com.klu.dto.VerifyOtpDto;
import com.klu.mail.Login;
import com.klu.mail.MailService;

@CrossOrigin(origins ="http://localhost:5173")
@RestController
@RequestMapping("/mail")
public class MailController {

	@Autowired
	MailService service;
	
	@PostMapping("/generateOtp")
	public String generateOtp(@RequestBody SignUpFormDto form) {
		String name = form.getName();
		String toMail = form.getMail();
		String password = form.getPassword();
		return service.generateOtp(name, toMail, password);
	}
	
	@PostMapping("/verifyOtp")
	public String verifyOtp(@RequestBody VerifyOtpDto dto) {
		String mail = dto.getMail();
		int otp = dto.getOtp();
		return service.verifyOtp(mail,otp);
	}
	
	@PostMapping("/login")
	public String login(@RequestBody Login req) {
		return service.login(req);
	}
	
	@PostMapping("/resend")
	public String reSend(@RequestParam String mail) {
		return service.reSend(mail);
	}
	
}
