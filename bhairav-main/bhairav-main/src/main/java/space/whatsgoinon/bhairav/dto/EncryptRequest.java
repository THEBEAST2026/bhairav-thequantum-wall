package space.whatsgoinon.bhairav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class EncryptRequest {

    @NotBlank
    @JsonProperty("id")
    private String id;           // Unique reference ID (e.g. "patient-001")

    @NotBlank
    @JsonProperty("data")
    private String data;         // Plaintext to encrypt

    @JsonProperty("session_id")
    private String sessionId;    // Optional — from /handshake. If null, uses fresh quantum key

    public String getId()        { return id; }
    public void   setId(String v){ this.id = v; }

    public String getData()        { return data; }
    public void   setData(String v){ this.data = v; }

    public String getSessionId()        { return sessionId; }
    public void   setSessionId(String v){ this.sessionId = v; }
}
