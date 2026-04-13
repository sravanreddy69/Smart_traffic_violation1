package com.traffic;

import com.traffic.model.User;
import com.traffic.model.ViolationType;
import com.traffic.model.enums.Role;
import com.traffic.repository.UserRepository;
import com.traffic.repository.ViolationTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ViolationTypeRepository typeRepository;

    @Override
    public void run(String... args) throws Exception {
        if(userRepository.count() == 0) {
            userRepository.save(new User(null, "Admin User", "admin@traffic.com", "1234567890", Role.ADMIN, null));
            userRepository.save(new User(null, "Officer Smith", "smith@traffic.com", "1234567891", Role.TRAFFIC_OFFICER, null));
            userRepository.save(new User(null, "Citizen John", "john@mail.com", "1234567892", Role.CITIZEN, null));
            userRepository.save(new User(null, "Reviewer Jane", "jane@traffic.com", "1234567893", Role.REVIEW_OFFICER, null));
        }

        if(typeRepository.count() == 0) {
            typeRepository.save(new ViolationType(null, "Speeding", "Exceeding speed limit", 100.0, null));
            typeRepository.save(new ViolationType(null, "Red Light", "Running a red light", 200.0, null));
            typeRepository.save(new ViolationType(null, "No Parking", "Parking in no parking zone", 50.0, null));
        }
    }
}
