package vn.edu.hcmut.intellilearn.learningservice.configuration;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfig {

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret:}")
    private String clientSecret;

    @Value("${keycloak.username:}")
    private String username;

    @Value("${keycloak.password:}")
    private String password;

    @Bean(destroyMethod = "close")
    public Keycloak keycloak() {
        KeycloakBuilder builder = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .clientId(clientId);

        if (clientSecret != null && !clientSecret.isBlank()) {
            builder.clientSecret(clientSecret)
                    .grantType("client_credentials");
        } else if (username != null && !username.isBlank()) {
            builder.username(username)
                    .password(password);
        } else {
            throw new IllegalStateException("No Keycloak credentials configured (client-secret or username/password)");
        }

        return builder.build();
    }
}
