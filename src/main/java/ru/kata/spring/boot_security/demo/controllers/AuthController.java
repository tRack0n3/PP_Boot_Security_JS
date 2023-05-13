package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.services.RegistrationService;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.util.UserValidator;

import javax.validation.Valid;

@Controller
public class AuthController {

    private final UserValidator userValidator;
    private final RegistrationService registrationService;
    private final RoleService roleService;
    private final RoleRepository roleRepository;

    @Autowired
    public AuthController(UserValidator userValidator, RegistrationService registrationService, RoleService roleService, RoleRepository roleRepository) {
        this.userValidator = userValidator;
        this.registrationService = registrationService;
        this.roleService = roleService;
        this.roleRepository = roleRepository;
    }

    @GetMapping("/index")
    public String indexPage() {

        return "index";
    }

    @GetMapping("/login")
    public String loginPage() {

        return "login";
    }

    @GetMapping("/registration")
    public String userRegistrationPage(@ModelAttribute("user") User user, Model role) {
        role.addAttribute("rolesList", roleService.getRolesList());

        return "registration";
    }

    @PostMapping("/registration")
    public String performRegistration(@ModelAttribute("user") @Valid User user,
                                      BindingResult bindingResult){

        userValidator.validate(user, bindingResult);
        if(bindingResult.hasErrors()) {
            return "registration";
        }
        registrationService.registrationForCommonUser(user);

        return "redirect:/login";
    }

    @GetMapping("/registration_admin_page")
    public String adminRegistrationPage(@ModelAttribute("admin")User user) {

        return "registration_admin_page";
    }

    @PostMapping("/registration_admin_page")
    public String registerNewAdmin(@ModelAttribute("admin") @Valid User user,
                                   BindingResult bindingResult){
        userValidator.validate(user, bindingResult);
        if(bindingResult.hasErrors()) {
            return "registration_admin_page";
        }
        registrationService.registrationForAdmin(user);

        return "redirect:/login";
    }


}
