
package com.staff_portal.academic_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.staff_portal.academic_service.model.Premises;

@Repository
public interface PremisesRepository extends JpaRepository<Premises, Integer> {

}
