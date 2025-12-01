package vn.edu.hcmut.intellilearn.teachingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
		"vn.edu.hcmut.intellilearn.teachingservice",
		"vn.edu.hcmut.intellilearn.utils"
})
public class TeachingserviceApplication {
	public static void main(String[] args) {
		SpringApplication.run(TeachingserviceApplication.class, args);
	}
}
