package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.services.AdminService;
import ru.kata.spring.boot_security.demo.services.RoleService;

import java.security.Principal;
import java.util.Collections;


@Controller
@RequestMapping
public class AdminController {
    private final AdminService adminService;
    private final RoleService roleService;

    @Autowired
    public AdminController(AdminService adminService, RoleService roleService) {
        this.adminService = adminService;
        this.roleService = roleService;
    }

    @GetMapping("/adm")
    public String adminPage(@ModelAttribute("user") User user, Model model, Principal principal) {
        model.addAttribute("rolesList", roleService.getRolesList());
        model.addAttribute("users", adminService.showAllUsers());
        model.addAttribute("admin", adminService.getUserByUsername(principal.getName()));
        model.addAttribute("newUser", new User());
        return "adminpage";
    }

    @PostMapping("/adm")
    public String add(@ModelAttribute("user") User user) {
        adminService.addUser(user);
        return "redirect:/adm";
    }

    @GetMapping("/test")
    public String testPage() {
        return "test";
    }

}
