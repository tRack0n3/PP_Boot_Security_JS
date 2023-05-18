package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.services.AdminService;

import java.security.Principal;

@Controller
@RequestMapping("/user")
public class UserController {
    private final AdminService adminService;

    @Autowired
    public UserController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping()
    public String userPage(Model model, Principal principal) {
        User princ = adminService.getUserByUsername(principal.getName());
        model.addAttribute("princ", princ);
        model.addAttribute("users", adminService.showAllUsers());
        return "user";
    }
}
