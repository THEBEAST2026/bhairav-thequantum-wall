package space.whatsgoinon.bhairav.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import space.whatsgoinon.bhairav.dto.EncryptRequest;
import space.whatsgoinon.bhairav.dto.EncryptResponse;
import space.whatsgoinon.bhairav.service.EncryptionService;

@RestController
public class EncryptController {

    @Autowired
    EncryptionService svc;

    @PostMapping("/encrypt")
    public EncryptResponse encrypt(@RequestBody @Valid EncryptRequest req) {
        try { return svc.encrypt(req); }
        catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
