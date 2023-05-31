package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import ru.kata.spring.boot_security.demo.entities.User;

import java.security.Principal;


@Controller
@RequestMapping
public class AdminPageController {

    @GetMapping("/adm")
    public String adminPage() {
        return "adminpage";
    }
}
