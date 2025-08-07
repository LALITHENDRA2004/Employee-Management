package net.javaguides.ems;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://127.0.0.1:5500")  // Allow frontend port
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // <-- this is important!
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(false);
    }
}
