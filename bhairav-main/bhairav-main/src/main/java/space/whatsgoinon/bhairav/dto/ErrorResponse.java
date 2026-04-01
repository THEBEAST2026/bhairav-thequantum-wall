package space.whatsgoinon.bhairav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    @JsonProperty("detail")
    private String detail;

    @JsonProperty("threat")
    private Boolean threat;           // true only on MITM/replay events

    @JsonProperty("type")
    private String type;              // e.g. "REPLAY_ATTACK", "STALE_TIMESTAMP"

    @JsonProperty("tip")
    private String tip;               // optional — shown on dashboard

    // ── Constructor for standard error ───────────────────────────────────
    public ErrorResponse(String detail) {
        this.detail = detail;
    }

    // ── Constructor for threat events ─────────────────────────────────────
    public ErrorResponse(String detail, String type, String tip) {
        this.detail = detail;
        this.threat = true;
        this.type   = type;
        this.tip    = tip;
    }

    // getters
    public String  getDetail()  { return detail; }
    public Boolean getThreat()  { return threat; }
    public String  getType()    { return type; }
    public String  getTip()     { return tip; }
}
