package vn.edu.hcmut.intellilearn.teachingservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.TeachingAssistantService;

@RestController
@RequiredArgsConstructor
public class TeachingAssistantController {
    public final TeachingAssistantService teachingAssistantService;
}
