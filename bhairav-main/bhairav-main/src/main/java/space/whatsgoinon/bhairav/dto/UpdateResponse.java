package space.whatsgoinon.bhairav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UpdateResponse {
    @JsonProperty("id")
    private String id;

    @JsonProperty("status")
    private String status;

    @JsonProperty("processingTimeMs")
    private long processingTimeMs;

    @JsonProperty("quantumEntropy")
    private boolean quantumEntropy;

    @JsonProperty("algorithm")
    private String algorithm;

    @JsonProperty("mitmCheck")
    private String mitmCheck;

    public UpdateResponse(String id, String status, long processingTimeMs, boolean quantumEntropy, String algorithm, String mitmCheck) {
        this.id = id;
        this.status = status;
        this.processingTimeMs = processingTimeMs;
        this.quantumEntropy = quantumEntropy;
        this.algorithm = algorithm;
        this.mitmCheck = mitmCheck;
    }

    // Getters
    public String getId() { return id; }
    public String getStatus() { return status; }
    public long getProcessingTimeMs() { return processingTimeMs; }
    public boolean isQuantumEntropy() { return quantumEntropy; }
    public String getAlgorithm() { return algorithm; }
    public String getMitmCheck() { return mitmCheck; }
}