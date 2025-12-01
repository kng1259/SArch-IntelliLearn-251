package vn.edu.hcmut.intellilearn.teachingservice.controller;

import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.KeycloakUserDetails;

import java.security.Principal;

/**
 * READ THIS FIRST!!!
 */
@RestController
@RequiredArgsConstructor
public class HelloController {
    private final Keycloak keycloak;

    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }

    @GetMapping("/hello-user")
    public String helloUser(Authentication authentication) {
        Principal principal = (Principal) authentication.getPrincipal();
        KeycloakUserDetails keycloakUserDetails = (KeycloakUserDetails) authentication.getDetails();

        return "Hello, User! Your principal name is: " + principal.getName() +
                " and your username is: " + keycloakUserDetails.getUsername() +
                " and your email is: " + keycloak.realm("intellilearn")
                .users().get("6aa5ed35-91b9-4cd6-80d3-9f4dff25846d")
                .toRepresentation()
                .getEmail();
    }
}