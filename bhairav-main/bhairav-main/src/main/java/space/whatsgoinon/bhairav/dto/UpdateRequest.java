package space.whatsgoinon.bhairav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class UpdateRequest {
    @NotBlank
    @JsonProperty("id")
    private String id;

    @NotBlank
    @JsonProperty("newData")
    private String newData;

    @JsonProperty("sessionId")
    private String sessionId;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNewData() { return newData; }
    public void setNewData(String newData) { this.newData = newData; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}