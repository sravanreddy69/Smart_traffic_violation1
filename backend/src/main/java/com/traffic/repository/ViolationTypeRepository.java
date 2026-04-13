package com.traffic.repository;

import com.traffic.model.ViolationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViolationTypeRepository extends JpaRepository<ViolationType, Long> {
}
