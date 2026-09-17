package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.klu.model.Collaboration;

@Repository
public interface CollaborationRepo extends JpaRepository<Collaboration,Integer>{

	List<Collaboration> findByStudent_StudentId(Long studentId);
	
	@Query("""
		    select c
		    from Collaboration c
		    where c.student.studentId in :studentIds
		      and c.status = true
		    order by c.collaboration_id desc
		""")
	List<Collaboration> findByFollowingStudentIds(@Param("studentIds") List<Long> studentIds);
	
}
