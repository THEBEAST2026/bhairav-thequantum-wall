package space.whatsgoinon.bhairav.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import space.whatsgoinon.bhairav.dto.HandshakeRequest;
import space.whatsgoinon.bhairav.dto.HandshakeResponse;
import space.whatsgoinon.bhairav.service.HybridKexService;

import java.util.Base64;

@RestController
public class HandshakeController {

    @Autowired
    HybridKexService kex;

    @PostMapping("/handshake")
    public HandshakeResponse handshake(@RequestBody HandshakeRequest req) throws Exception {
        byte[] clientKyberPub = Base64.getDecoder().decode(req.getKemPublicKey());
        byte[] clientEccPub   = Base64.getDecoder().decode(req.getEccPublicKey());

        HybridKexService.HandshakeResult result =
                kex.performHandshake(clientKyberPub, clientEccPub);

        return new HandshakeResponse(
                result.sessionId(),
                Base64.getEncoder().encodeToString(result.kyberCiphertext()),
                Base64.getEncoder().encodeToString(result.serverEccPub()),
                "ML-KEM-768 + P-256 ECDH + ANU-QRNG",
                true
        );
    }
}
