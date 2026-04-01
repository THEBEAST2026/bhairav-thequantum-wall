package space.whatsgoinon.bhairav.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.media.StringSchema;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Quantum Wall API").version("1.0")
                        .description("Post-quantum encryption"))
                .components(new Components()
                        .addParameters("X-API-Key", new Parameter()
                                .name("X-API-Key").in("header").required(true)
                                .description("API Key from application.yml")
                                .schema(new StringSchema().example("yoursecretapikeyhere")))
                        .addParameters("X-Nonce", new Parameter()
                                .name("X-Nonce").in("header").required(true)
                                .description("Unique nonce per request")
                                .schema(new StringSchema().example("testnonce123")))
                        .addParameters("X-Timestamp", new Parameter()
                                .name("X-Timestamp").in("header").required(true)
                                .description("Unix timestamp")
                                .schema(new StringSchema().example("1743292800"))));
    }
}