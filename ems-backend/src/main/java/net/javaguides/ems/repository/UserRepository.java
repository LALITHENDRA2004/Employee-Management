package net.javaguides.ems.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import net.javaguides.ems.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserName(String userName);

    boolean existsByUserName(String userName);
}