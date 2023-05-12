package ru.kata.spring.boot_security.demo.services;


import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ru.kata.spring.boot_security.demo.entities.Roles;
import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // делаем обертку, чтобы не обращаться напрямую к userRepository
    public User findByUsername (String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(String.format("User '%s' not found!"));
        }

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                mapRolesToAuthorities(user.getRoles()));
    }

    // Метод для преобразования role к authority, чтобы Spring мог распознать роль, как право доступа.
    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Roles> roles) {
        return roles.stream().map(r -> new SimpleGrantedAuthority(r.getRoleName())).collect(Collectors.toList());
    }
}
