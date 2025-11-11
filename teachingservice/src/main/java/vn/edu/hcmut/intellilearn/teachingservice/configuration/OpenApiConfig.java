package vn.edu.hcmut.intellilearn.teachingservice.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String REMOTE_USER_SCHEME = "keycloak-remote-user-header";
        final String REMOTE_SUB_SCHEME = "keycloak-remote-sub-header";
        final String REMOTE_ROLES_SCHEME = "keycloak-remote-roles-header";

        return new OpenAPI()
                .info(new Info().title("Teaching Service API").version("1.0.0"))
                .components(new Components()
                        // X-Remote-User header
                        .addSecuritySchemes(REMOTE_USER_SCHEME,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER)
                                        .name("X-Remote-User")
                                        .description("Remote user (principal) header injected by the proxy/ingress"))
                        // X-Remote-Sub header
                        .addSecuritySchemes(REMOTE_SUB_SCHEME,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER)
                                        .name("X-Remote-Sub")
                                        .description("Remote subject (user id) header injected by the proxy/ingress"))
                        // X-Remote-Roles header
                        .addSecuritySchemes(REMOTE_ROLES_SCHEME,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER)
                                        .name("X-Remote-Roles")
                                        .description("Remote roles (comma-separated) header injected by the proxy/ingress"))
                )
                // Require all three headers (they are ANDed when put into the same SecurityRequirement)
                .addSecurityItem(new SecurityRequirement()
                        .addList(REMOTE_USER_SCHEME)
                        .addList(REMOTE_SUB_SCHEME)
                        .addList(REMOTE_ROLES_SCHEME));
    }
}
