package vn.edu.hcmut.intellilearn.utils.mapper;

import org.mapstruct.Mapper;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Feedback;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.FeedbackRequest;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {
    Feedback toFeedBack(FeedbackRequest request);
}
