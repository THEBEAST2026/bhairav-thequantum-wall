package space.whatsgoinon.bhairav.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import space.whatsgoinon.bhairav.dto.DecryptResponse;
import space.whatsgoinon.bhairav.dto.EncryptRequest;
import space.whatsgoinon.bhairav.dto.EncryptResponse;
import space.whatsgoinon.bhairav.entity.Encrypt;
import space.whatsgoinon.bhairav.repository.EncryptedRecordRepository;

@Service
public class EncryptionService {

    @Autowired
    QuantumEntropyService qrng;
    @Autowired HybridKexService kex;
    @Autowired AesCryptoService aesCrypto;
    @Autowired
    EncryptedRecordRepository repo;

    public EncryptResponse encrypt(EncryptRequest req) throws Exception {
        long start = System.currentTimeMillis();

        byte[] aesKey;
        if (req.getSessionId() != null && !req.getSessionId().isBlank()) {
            aesKey = kex.getSessionKey(req.getSessionId()); // from handshake
        } else {
            aesKey = qrng.getQuantumBytes(32); // fresh quantum key
        }

        String ciphertext = aesCrypto.encrypt(req.getData(), aesKey);

        Encrypt record = new Encrypt();
        record.setId(req.getId());
        record.setCiphertext(ciphertext);
        record.setEncKey(aesKey);
        repo.save(record);


        return new EncryptResponse(req.getId(), "stored",
                System.currentTimeMillis() - start, true, "ML-KEM-768+P-256+AES-256-GCM");
    }

    public DecryptResponse decrypt(String id) throws Exception {
        long start = System.currentTimeMillis();
        Encrypt rec = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));

        String plain = aesCrypto.decrypt(rec.getCiphertext(), rec.getEncKey());
        return new DecryptResponse(plain, rec.getCiphertext(),
                System.currentTimeMillis() - start);
    }
    public void update(String id, String newData, String sessionId) throws Exception {
        Encrypt rec = repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));
        byte[] aesKey = (sessionId != null && !sessionId.isBlank()) ?
                kex.getSessionKey(sessionId) : qrng.getQuantumBytes(32);
        String newCiphertext = aesCrypto.encrypt(newData, aesKey);
        rec.setCiphertext(newCiphertext);
        rec.setEncKey(aesKey);  // byte[]
        repo.save(rec);
    }
}
