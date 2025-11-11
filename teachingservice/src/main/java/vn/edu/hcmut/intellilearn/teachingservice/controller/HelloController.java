package vn.edu.hcmut.intellilearn.teachingservice.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.hcmut.intellilearn.teachingservice.core.KeycloakUserDetails;

import java.security.Principal;

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }

    @GetMapping("/hello-user")
    public String helloUser(Authentication authentication) {
        Principal principal = (Principal) authentication.getPrincipal();
        KeycloakUserDetails keycloakUserDetails = (KeycloakUserDetails) authentication.getDetails();

        return "Hello, User! Your principal name is: " + principal.getName() +
                " and your username is: " + keycloakUserDetails.getUsername();
    }
}