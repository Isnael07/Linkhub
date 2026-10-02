package com.project.mylinks.application.service;


import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BucketService {

    private static final String BUCKET = "avatars";
    private static final String UPSERT_HEADER = "x-upsert";
    private static final int MAX_FILE_SIZE = 5 * 1024 * 1024;

    private final RestClient supabaseRestClient;

    public String uploadAvatar(UUID userId, MultipartFile file) throws IOException {

        MediaType contentType = validateFile(file);

        String path = buildAvatarPath(userId);

        ByteArrayResource resource = createResource(file);

        upload(path, contentType, resource, file.getSize(), false);

        return path;
    }

    public String updateAvatar(UUID userId, MultipartFile file) throws IOException {

        MediaType contentType = validateFile(file);

        String path = buildAvatarPath(userId);

        ByteArrayResource resource = createResource(file);

        upload(path, contentType, resource, file.getSize(), true);

        return path;
    }

    private MediaType validateFile(MultipartFile file) {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo vazio");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "A imagem deve ter no máximo 5 MB"
            );
        }

        String contentType = file.getContentType();

        if (contentType == null) {
            throw new IllegalArgumentException(
                    "Tipo do arquivo não informado"
            );
        }

        MediaType mediaType = MediaType.parseMediaType(contentType);

        if (!isSupportedImage(mediaType)) {
            throw new IllegalArgumentException(
                    "Formato de imagem não suportado"
            );
        }

        return mediaType;
    }

    private boolean isSupportedImage(MediaType mediaType) {

        return MediaType.IMAGE_JPEG.equals(mediaType)
                || MediaType.IMAGE_PNG.equals(mediaType);
    }

    private String buildAvatarPath(UUID userId) {
        return userId + "/profile";
    }

    private ByteArrayResource createResource(MultipartFile file)
            throws IOException {

        return new ByteArrayResource(file.getBytes()) {

            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

    }
    private void upload(
            String path,
            MediaType contentType,
            ByteArrayResource resource,
            long fileSize,
            boolean upsert
    ) {

        supabaseRestClient
                .post()
                .uri(
                        "/storage/v1/object/{bucket}/{path}",
                        BUCKET,
                        path
                )
                .contentType(contentType)
                .header(
                        HttpHeaders.CONTENT_LENGTH,
                        String.valueOf(fileSize)
                )
                .header(UPSERT_HEADER, String.valueOf(upsert))
                .body(resource)
                .retrieve()
                .toBodilessEntity();
    }
}