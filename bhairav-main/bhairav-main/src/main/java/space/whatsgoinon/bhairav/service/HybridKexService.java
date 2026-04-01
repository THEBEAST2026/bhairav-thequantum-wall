package space.whatsgoinon.bhairav.service;

import net.rubyeye.xmemcached.MemcachedClient;
import org.bouncycastle.crypto.AsymmetricCipherKeyPair;
import org.bouncycastle.crypto.SecretWithEncapsulation;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.generators.HKDFBytesGenerator;
import org.bouncycastle.crypto.params.HKDFParameters;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.pqc.crypto.crystals.kyber.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.KeyAgreement;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.UUID;

@Service
public class HybridKexService {

    @Autowired
    QuantumEntropyService qrng;
    @Autowired
    MemcachedClient memcached;

    static { Security.addProvider(new BouncyCastleProvider()); }

    // ── Server-side keypair (generated once at startup) ─────────────────
    private final KyberPrivateKeyParameters serverKyberPriv;
    private final KyberPublicKeyParameters serverKyberPub;
    private final KeyPair serverEccKeyPair;

    public HybridKexService() throws Exception {
        // ML-KEM Kyber-768 keypair
        KyberKeyPairGenerator kyberGen = new KyberKeyPairGenerator();
        kyberGen.init(new KyberKeyGenerationParameters(
                new SecureRandom(), KyberParameters.kyber768));
        AsymmetricCipherKeyPair kyberPair = kyberGen.generateKeyPair();
        serverKyberPriv = (KyberPrivateKeyParameters) kyberPair.getPrivate();
        serverKyberPub  = (KyberPublicKeyParameters)  kyberPair.getPublic();

        // ECC P-256 keypair
        KeyPairGenerator eccGen = KeyPairGenerator.getInstance("EC", "BC");
        eccGen.initialize(new ECGenParameterSpec("P-256"), new SecureRandom());
        serverEccKeyPair = eccGen.generateKeyPair();
    }

    // ── Handshake: client sends pub keys, server returns session_id ──────
    public HandshakeResult performHandshake(
            byte[] clientKyberPubBytes, byte[] clientEccPubBytes) throws Exception {

        String sessionId = UUID.randomUUID().toString();

        // 1. ML-KEM Kyber-768 encapsulation
        KyberPublicKeyParameters clientKyberPub =
                new KyberPublicKeyParameters(KyberParameters.kyber768, clientKyberPubBytes);
        KyberKEMGenerator kemGen = new KyberKEMGenerator(new SecureRandom());
        SecretWithEncapsulation encap = kemGen.generateEncapsulated(clientKyberPub);
        byte[] kyberSecret    = encap.getSecret();      // 32 bytes
        byte[] kyberCiphertext = encap.getEncapsulation(); // 1088 bytes

        // 2. ECC P-256 ECDH
        KeyFactory kf = KeyFactory.getInstance("EC", "BC");
        PublicKey clientEccPub =
                kf.generatePublic(new X509EncodedKeySpec(clientEccPubBytes));
        KeyAgreement ecdh = KeyAgreement.getInstance("ECDH", "BC");
        ecdh.init(serverEccKeyPair.getPrivate());
        ecdh.doPhase(clientEccPub, true);
        byte[] ecdhSecret = ecdh.generateSecret(); // 32 bytes

        // 3. ANU QRNG — 32 true quantum bytes
        byte[] quantumBytes = qrng.getQuantumBytes(32);

        // 4. HKDF-SHA256: XOR all three sources then derive
        byte[] ikm = xorBytes(kyberSecret, ecdhSecret, quantumBytes);
        byte[] aesKey = hkdfDerive(ikm, sessionId.getBytes());

        // 5. Store AES key in Memcached under session:<sessionId>
        memcached.set("session:" + sessionId, 3600, aesKey);

        return new HandshakeResult(sessionId, kyberCiphertext,
                serverKyberPub.getEncoded(), serverEccKeyPair.getPublic().getEncoded(),
                aesKey);
    }

    // ── XOR three byte arrays ─────────────────────────────────────────────
    private byte[] xorBytes(byte[] a, byte[] b, byte[] c) {
        byte[] result = new byte[32];
        for (int i = 0; i < 32; i++)
            result[i] = (byte)(a[i % a.length] ^ b[i % b.length] ^ c[i % c.length]);
        return result;
    }

    // ── HKDF-SHA256 (RFC 5869) ────────────────────────────────────────────
    private byte[] hkdfDerive(byte[] ikm, byte[] salt) throws Exception {
        HKDFBytesGenerator hkdf = new HKDFBytesGenerator(new SHA256Digest());
        hkdf.init(new HKDFParameters(ikm, salt,
                "quantum-wall-hybrid-kex-v1".getBytes()));
        byte[] key = new byte[32];
        hkdf.generateBytes(key, 0, 32);
        return key;
    }

    // ── Retrieve session AES key from Memcached ───────────────────────────
    public byte[] getSessionKey(String sessionId) throws Exception {
        Object key = memcached.get("session:" + sessionId);
        if (key == null) throw new RuntimeException("Session not found");
        return (byte[]) key;
    }
    public record HandshakeResult(
            String sessionId,
            byte[] kyberCiphertext,   // 1088 bytes — send to client
            byte[] serverKyberPub,    // server Kyber public key bytes
            byte[] serverEccPub,      // server ECC P-256 public key bytes (X.509 encoded)
            byte[] aesKey             // derived 32-byte AES key — stored in Memcached
    ) {}
}
