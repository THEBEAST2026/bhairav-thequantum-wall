package space.whatsgoinon.bhairav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class HandshakeRequest {

    @NotBlank
    @JsonProperty("kem_public_key")
    private String kemPublicKey;   // Base64-encoded ML-KEM Kyber-768 public key (1184 bytes)

    @NotBlank
    @JsonProperty("ecc_public_key")
    private String eccPublicKey;   // Base64-encoded ECC P-256 public key

    public String getKemPublicKey() { return kemPublicKey; }
    public void setKemPublicKey(String v) { this.kemPublicKey = v; }

    public String getEccPublicKey() { return eccPublicKey; }
    public void setEccPublicKey(String v) { this.eccPublicKey = v; }
}