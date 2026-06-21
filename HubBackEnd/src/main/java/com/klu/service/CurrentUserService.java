package com.klu.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.klu.model.Student;
import com.klu.repository.StudentRepo;

@Service
public class CurrentUserService {

    @Autowired
    private StudentRepo studentRepo;

    public Student getCurrentStudent() {

        Authentication auth =SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return studentRepo.findByStudentEmail(email);
    }
}
