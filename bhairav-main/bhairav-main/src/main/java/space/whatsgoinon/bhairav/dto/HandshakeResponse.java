package space.whatsgoinon.bhairav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HandshakeResponse {

    @JsonProperty("session_id")
    private String sessionId;          // UUID — use this in /encrypt requests

    @JsonProperty("kem_ciphertext")
    private String kemCiphertext;      // Base64 ML-KEM ciphertext (1088 bytes)

    @JsonProperty("server_ecc_pub")
    private String serverEccPub;       // Base64 server P-256 public key

    @JsonProperty("algorithm")
    private String algorithm;          // e.g. "ML-KEM-768 + P-256 ECDH + ANU-QRNG"

    @JsonProperty("quantum_entropy")
    private boolean quantumEntropy;    // always true

    // ── All-args constructor ─────────────────────────────────────────────
    public HandshakeResponse(String sessionId, String kemCiphertext,
                             String serverEccPub, String algorithm, boolean quantumEntropy) {
        this.sessionId      = sessionId;
        this.kemCiphertext  = kemCiphertext;
        this.serverEccPub   = serverEccPub;
        this.algorithm      = algorithm;
        this.quantumEntropy = quantumEntropy;
    }

    // getters
    public String  getSessionId()     { return sessionId; }
    public String  getKemCiphertext() { return kemCiphertext; }
    public String  getServerEccPub()  { return serverEccPub; }
    public String  getAlgorithm()     { return algorithm; }
    public boolean isQuantumEntropy() { return quantumEntropy; }
}
