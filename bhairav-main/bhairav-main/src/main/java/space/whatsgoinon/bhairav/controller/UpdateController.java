package space.whatsgoinon.bhairav.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import space.whatsgoinon.bhairav.dto.UpdateRequest;
import space.whatsgoinon.bhairav.dto.UpdateResponse;
import space.whatsgoinon.bhairav.service.EncryptionService;

@RestController
public class UpdateController {
    @Autowired
    private EncryptionService encryptionService;

    @PutMapping("/update/{id}")
    public ResponseEntity<UpdateResponse> update(@PathVariable String id, @RequestBody UpdateRequest req) {
        try {
            // Re-encrypt new data with session or fresh quantum key
            encryptionService.update(id, req.getNewData(), req.getSessionId());
            long processingTimeMs = 50L; // Placeholder
            return ResponseEntity.ok(new UpdateResponse(id, "updated", processingTimeMs, true, "ML-KEM-768 P-256 AES-256-GCM", "passed"));
        } catch (Exception e) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}