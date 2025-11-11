package vn.edu.hcmut.intellilearn.teachingservice.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import vn.edu.hcmut.intellilearn.teachingservice.core.KeycloakPrincipal;
import vn.edu.hcmut.intellilearn.teachingservice.core.KeycloakUserDetails;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Slf4j
public class KeycloakFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {
        String userHeader = request.getHeader("X-Remote-User");
        String subHeader = request.getHeader("X-Remote-Sub");
        String rolesHeader = request.getHeader("X-Remote-Roles");

        if (userHeader == null || subHeader == null || rolesHeader == null) {
            filterChain.doFilter(request, response);
            return;
        }

        UUID userId;
        try {
            userId = UUID.fromString(subHeader);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid UUID format in X-Remote-Sub header: {}", subHeader);
            filterChain.doFilter(request, response);
            return;
        }

        KeycloakPrincipal principal = new KeycloakPrincipal(UUID.fromString(subHeader));

        List<SimpleGrantedAuthority> roles = Stream.of(rolesHeader.split(","))
                .map(String::trim)
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .toList();

        KeycloakUserDetails userDetails = KeycloakUserDetails
                .builder()
                .userId(userId)
                .username(userHeader)
                .roles(roles)
                .build();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(principal, null, roles);
        authentication.setDetails(userDetails);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
