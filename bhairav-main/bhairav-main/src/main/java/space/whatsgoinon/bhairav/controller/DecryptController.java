package space.whatsgoinon.bhairav.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import space.whatsgoinon.bhairav.dto.DecryptResponse;
import space.whatsgoinon.bhairav.service.EncryptionService;

@RestController
public class DecryptController {

    @Autowired
    EncryptionService svc;

    @GetMapping("/decrypt/{id}")
    public DecryptResponse decrypt(@PathVariable String id) {
        try { return svc.decrypt(id); }
        catch (ResponseStatusException e) { throw e; }
        catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
