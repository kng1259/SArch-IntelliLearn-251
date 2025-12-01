package vn.edu.hcmut.intellilearn.learningservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class LearningserviceApplication {
//	TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
	public static void main(String[] args) {
		SpringApplication.run(LearningserviceApplication.class, args);
	}

}
