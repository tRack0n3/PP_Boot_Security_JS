package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.services.AdminService;

import java.security.Principal;

@Controller
@RequestMapping("/user")
public class UserPageController {

    @GetMapping()
    public String userPage() {
        return "user";
    }
}
