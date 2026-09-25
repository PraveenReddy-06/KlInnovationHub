package com.klu.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.klu.exception.ForbiddenException;
import com.klu.exception.UnauthorizedException;
import com.klu.model.Student;
import com.klu.repository.StudentRepo;

@Service
public class CurrentUserService {

    @Autowired
    private StudentRepo studentRepo;

    public Student getCurrentStudent() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getName())) {
            throw new UnauthorizedException("Authentication required");
        }

        if (auth.getAuthorities().stream()
                .noneMatch(a -> "ROLE_STUDENT".equals(a.getAuthority()))) {
            throw new ForbiddenException("This account does not have student access");
        }

        Student student = studentRepo.findByStudentEmail(auth.getName());

        if (student == null) {
            throw new ForbiddenException("Student profile not found for this account");
        }

        return student;
    }
}
