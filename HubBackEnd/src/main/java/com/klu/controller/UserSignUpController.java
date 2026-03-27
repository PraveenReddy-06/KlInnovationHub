package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.SignUpFormDto;
import com.klu.mail.Login;
import com.klu.mail.MailService;

@CrossOrigin(origins ="http://localhost:5174")
@RestController
@RequestMapping("/api/mail")
public class UserSignUpController {
	
	@Autowired
	MailService service;
	
	@PostMapping("/generateOtp")
	public ResponseEntity<?> generateOtp(@RequestBody SignUpFormDto form){
		String res = service.generateOpt(form.getName(), form.getMail(), form.getPassword());		
		return ResponseEntity.ok(res);
	}
	
	@PostMapping("/verify/{mail}/{otp}")
	public String verifyOtp(@PathVariable String mail,@PathVariable int otp) {
		return service.VerifyOtp(mail, otp);
	}
	
	@PostMapping("/login")
	public String loginReq(@RequestBody Login user) {
		return service.login(user);
	}
	
	@PostMapping("/resend/{mail}")
	public String reSend(@PathVariable String mail) {
		return service.reSend(mail);
	}

}
