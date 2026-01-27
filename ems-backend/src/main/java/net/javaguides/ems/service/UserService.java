package net.javaguides.ems.service;

import java.util.Optional;
import net.javaguides.ems.entity.User;

public interface UserService {
    boolean signup(String userName, String rawPassword);

    boolean signin(String userName, String rawPassword);

    Optional<User> findByUserName(String userName);

    boolean resetPassword(String userName, String newPassword);
}