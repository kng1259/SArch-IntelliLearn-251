package vn.edu.hcmut.intellilearn.teachingservice.domain.minio;

import org.springframework.web.multipart.MultipartFile;

public interface MinioService {
    public String uploadFile(MultipartFile file);
}
