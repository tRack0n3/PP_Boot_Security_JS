package ru.kata.spring.boot_security.demo.services;

import org.springframework.data.jpa.repository.Query;
import ru.kata.spring.boot_security.demo.entities.Role;
import ru.kata.spring.boot_security.demo.entities.User;

import java.util.List;

public interface RoleService {

    List<Role> getRolesList();


}
