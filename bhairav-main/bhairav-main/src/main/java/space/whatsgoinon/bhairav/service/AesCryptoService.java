package space.whatsgoinon.bhairav.service;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

@Service
public class AesCryptoService {

    /**
     * Encrypt plaintext using AES-256-GCM.
     * Returns Base64(iv[12] + tag[16] + ciphertext).
     */
    public String encrypt(String plaintext, byte[] key) throws Exception {
        if (key.length != 32) throw new IllegalArgumentException("Key must be 32 bytes");

        byte[] iv = new byte[12];
        new SecureRandom().nextBytes(iv);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE,
                new SecretKeySpec(key, "AES"),
                new GCMParameterSpec(128, iv));

        byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
        // ciphertext already contains 16-byte GCM tag appended by Java

        ByteBuffer buf = ByteBuffer.allocate(12 + ciphertext.length);
        buf.put(iv);
        buf.put(ciphertext);
        return Base64.getEncoder().encodeToString(buf.array());
    }

    /**
     * Decrypt Base64(iv[12] + tag[16] + ciphertext).
     */
    public String decrypt(String encoded, byte[] key) throws Exception {
        byte[] data = Base64.getDecoder().decode(encoded);
        if (data.length < 28) throw new IllegalArgumentException("Invalid ciphertext");

        byte[] iv         = Arrays.copyOfRange(data, 0,  12);
        byte[] ciphertext = Arrays.copyOfRange(data, 12, data.length); // tag embedded

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE,
                new SecretKeySpec(key, "AES"),
                new GCMParameterSpec(128, iv));

        byte[] plain = cipher.doFinal(ciphertext);
        return new String(plain, StandardCharsets.UTF_8);
    }
}
