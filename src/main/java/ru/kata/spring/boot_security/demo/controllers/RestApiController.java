package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entities.Role;
import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.services.AdminService;
import ru.kata.spring.boot_security.demo.services.RoleService;

import java.util.Collection;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping({"/api/admin"})
public class RestApiController {

    private final AdminService adminService;
    private final RoleService roleService;

    @Autowired
    public RestApiController(AdminService adminService, RoleService roleService) {
        this.adminService = adminService;
        this.roleService = roleService;
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return adminService.showAllUsers();// Jackson автоматически конвертирует объекты в JSON

    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Optional> getUser(@PathVariable("id") Long id) {
        Optional<User> foundUser = adminService.getUserById(id);

        return new ResponseEntity<>(foundUser, HttpStatus.OK);
    }

    @GetMapping("/roles")
    public ResponseEntity<Collection<Role>> getRoles() {
        Collection<Role> roles = roleService.getRolesList();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

    // @RequestBody - принимает JSON от клиента и конвертирует его в Java объекты
    @PostMapping("/new")
    public ResponseEntity<HttpStatus> create (@RequestBody User user) {
        this.adminService.addUser(user);

        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PatchMapping("/user/{id}")
    public ResponseEntity<HttpStatus> update(@RequestBody User user,
                                             @PathVariable("id") Long id) {
        this.adminService.editUser(id, user);

        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
        this.adminService.deleteUser(id);

        return ResponseEntity.ok(HttpStatus.OK);
    }
}