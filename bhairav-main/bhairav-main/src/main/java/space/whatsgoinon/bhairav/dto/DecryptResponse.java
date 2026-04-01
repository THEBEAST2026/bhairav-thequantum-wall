package space.whatsgoinon.bhairav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DecryptResponse {

    @JsonProperty("decrypted_data")
    private String decryptedData;          // Original plaintext

    @JsonProperty("actual_encrypted_data")
    private String actualEncryptedData;    // Base64(iv + tag + ciphertext) from DB

    @JsonProperty("processing_time_ms")
    private long processingTimeMs;

    // ── All-args constructor ─────────────────────────────────────────────
    public DecryptResponse(String decryptedData,
                           String actualEncryptedData, long processingTimeMs) {
        this.decryptedData       = decryptedData;
        this.actualEncryptedData = actualEncryptedData;
        this.processingTimeMs    = processingTimeMs;
    }

    // getters
    public String getDecryptedData()       { return decryptedData; }
    public String getActualEncryptedData() { return actualEncryptedData; }
    public long   getProcessingTimeMs()    { return processingTimeMs; }
}
