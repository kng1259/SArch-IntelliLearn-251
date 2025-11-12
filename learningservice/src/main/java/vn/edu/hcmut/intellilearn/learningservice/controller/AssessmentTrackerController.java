package vn.edu.hcmut.intellilearn.learningservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.hcmut.intellilearn.learningservice.domain.assessmenttracker.AssessmentTrackerService;

@RestController
@RequestMapping("/assessment-tracker")
@RequiredArgsConstructor
public class AssessmentTrackerController {
    private final AssessmentTrackerService assessmentTrackerService;
}
