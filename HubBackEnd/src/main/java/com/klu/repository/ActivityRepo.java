package com.klu.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.klu.model.Activity;

public interface ActivityRepo extends JpaRepository<Activity, Long>{

    List<Activity> findTop15ByOrderByCreatedAtDesc();

}