package com.klu.service.implementation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.klu.exception.ForbiddenException;
import com.klu.model.CollabApplication;
import com.klu.model.Collaboration;
import com.klu.model.Student;
import com.klu.repository.CollabApplicationRepo;
import com.klu.service.CurrentUserService;

@ExtendWith(MockitoExtension.class)
class CollabApplicationImpleTest {

    @Mock
    private CollabApplicationRepo applications;

    @Mock
    private CurrentUserService currentUser;

    @InjectMocks
    private CollabApplicationImple service;

    @Test
    void incomingApplicationsAreScopedToTheSignedInTeamOwner() throws Exception {
        when(currentUser.getCurrentStudent()).thenReturn(student(101L));
        Student applicant = student(202L);
        applicant.setStudent_name("Synthetic Student");
        applicant.setStudentEmail("student@example.test");
        applicant.setBranch("CSE");
        applicant.setYear(2);

        Collaboration team = new Collaboration();
        team.setCollaboration_id(55);
        team.setStudent(student(101L));
        CollabApplication application = new CollabApplication(8, team, applicant, "PENDING");
        when(applications.findByCollaboration_Student_StudentId(101L)).thenReturn(List.of(application));

        var responses = service.getIncomingApplications();

        verify(applications).findByCollaboration_Student_StudentId(101L);
        verifyNoMoreInteractions(applications);
        assertEquals(1, responses.size());

        ObjectMapper mapper = new ObjectMapper();
        assertEquals(mapper.readTree("""
                {
                  "collabApplication_id": 8,
                  "status": "PENDING",
                  "collaboration": {"collaboration_id": 55},
                  "student": {"studentId": 202, "student_name": "Synthetic Student", "branch": "CSE", "year": 2}
                }
                """), mapper.readTree(mapper.writeValueAsString(responses.get(0))));
    }

    @Test
    void aStudentCanReadTheirOwnApplications() {
        when(currentUser.getCurrentStudent()).thenReturn(student(202L));
        when(applications.findByStudent_StudentId(202L)).thenReturn(List.of());

        assertEquals(List.of(), service.getMyApplications(202L));
        verify(applications).findByStudent_StudentId(202L);
        verifyNoMoreInteractions(applications);
    }

    @Test
    void applicationReadsRequireTheSignedInStudent() {
        when(currentUser.getCurrentStudent()).thenReturn(student(202L));

        assertThrows(ForbiddenException.class, () -> service.getMyApplications(101L));
        verifyNoInteractions(applications);
    }

    @Test
    void nonStudentAccountsCannotReadApplications() {
        when(currentUser.getCurrentStudent()).thenThrow(new ForbiddenException("Student access required"));

        assertThrows(ForbiddenException.class, service::getIncomingApplications);
        assertThrows(ForbiddenException.class, () -> service.getMyApplications(202L));
        verifyNoInteractions(applications);
    }

    private static Student student(long id) {
        Student student = new Student();
        student.setStudentId(id);
        return student;
    }
}
