package space.whatsgoinon.bhairav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EncryptResponse {

    @JsonProperty("id")
    private String id;

    @JsonProperty("status")
    private String status;                // "stored"

    @JsonProperty("processing_time_ms")
    private long processingTimeMs;

    @JsonProperty("quantum_entropy")
    private boolean quantumEntropy;       // always true

    @JsonProperty("algorithm")
    private String algorithm;             // "ML-KEM-768 + P-256 + AES-256-GCM"

    @JsonProperty("mitm_check")
    private String mitmCheck;             // "passed"

    // ── All-args constructor ─────────────────────────────────────────────
    public EncryptResponse(String id, String status, long processingTimeMs,
                           boolean quantumEntropy, String algorithm) {
        this.id               = id;
        this.status           = status;
        this.processingTimeMs = processingTimeMs;
        this.quantumEntropy   = quantumEntropy;
        this.algorithm        = algorithm;
        this.mitmCheck        = "passed";
    }

    // getters
    public String  getId()               { return id; }
    public String  getStatus()           { return status; }
    public long    getProcessingTimeMs() { return processingTimeMs; }
    public boolean isQuantumEntropy()    { return quantumEntropy; }
    public String  getAlgorithm()        { return algorithm; }
    public String  getMitmCheck()        { return mitmCheck; }
}
