package vn.edu.hcmut.intellilearn.teachingservice.domain.minio;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioServiceImpl implements MinioService {
    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.public-url:${minio.url}}")
    private String publicUrl;

    @Override
    public String uploadFile(MultipartFile file){
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            //create bucket if not exist
            if(!found){
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }

            String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
            String fileName = UUID.randomUUID().toString() + "_" + originalFilename;

            // Set Content-Disposition header để browser download file thay vì mở trực tiếp
            Map<String, String> headers = new HashMap<>();
            headers.put("Content-Disposition", "attachment; filename=\"" + originalFilename + "\"");

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .headers(headers)
                            .build()
            );

            return String.format("%s/%s/%s", publicUrl, bucketName, fileName);
        }
        catch (Exception e) {
            log.error("Error when upload file to MinIO", e);
            throw new RuntimeException("Upload file thất bại");
        }
    }
}
