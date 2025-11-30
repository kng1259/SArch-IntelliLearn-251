package vn.edu.hcmut.intellilearn.learningservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.hcmut.intellilearn.learningservice.domain.learninganalyzer.LearningAnalyzerService;

@RestController
@RequestMapping("/learning-analyzer")
@RequiredArgsConstructor
public class LearningAnalyzerController {
    private final LearningAnalyzerService learningAnalyzerService;
}
