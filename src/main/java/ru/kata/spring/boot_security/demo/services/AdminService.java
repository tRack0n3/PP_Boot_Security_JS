package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.entities.User;

import java.util.List;
import java.util.Optional;

public interface AdminService {

    List<User> showAllUsers();

    void addUser(User user);

    User getUserById(Long id);

    User getUserByUsername(String username);

    void deleteUser(Long id);

    void editUser(Long id, User updatedUser);

}
