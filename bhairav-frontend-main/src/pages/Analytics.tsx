import { useState } from "react";
import { SectionLabel, Tag } from "@/components/QuantumUI";
import { rnd, useInterval } from "@/lib/quantum-utils";

export default function Analytics() {
    const [latData, setLatData] = useState(() => Array.from({ length: 24 }, (_, i) => ({ h: i, v: rnd(8, 20) })));
    const [encData] = useState(() => Array.from({ length: 7 }, (_, i) => ({ d: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], v: Math.floor(rnd(1800, 3200)) })));
    const [threats, setThreats] = useState(1247);
    const [uptime] = useState(99.997);
    const [keyRot, setKeyRot] = useState(487);
    const [liveReqs, setLiveReqs] = useState(14218);

    useInterval(() => {
        setLiveReqs(r => r + Math.floor(rnd(0, 5)));
        setLatData(d => {
            const nd = [...d]; nd.push({ h: nd.length, v: rnd(8, 22) }); nd.shift(); return nd;
        });
        if (Math.random() > .92) setThreats(t => t + 1);
        if (Math.random() > .97) setKeyRot(k => k + 1);
    }, 1400);

    const maxLat = Math.max(...latData.map(d => d.v));
    const maxEnc = Math.max(...encData.map(d => d.v));

    return (
        <div
            style={{
                fontFamily: "'JetBrains Mono',monospace",
                padding: "calc(58px + 32px) 32px 60px",
                maxWidth: 1400,
                margin: "0 auto",
                animation: "pageIn .4s ease",
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: 36 }}>
                <SectionLabel>ANALYTICS</SectionLabel>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 700, color: "#E6E8EE", marginBottom: 8 }}>
                    System Performance
                </h2>
                <p style={{ fontSize: 12, color: "#88A3D6" }}>
                    Live metrics from your Quantum Wall deployment — updated every 1.4s.
                </p>
            </div>

            {/* KPI Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14, marginBottom: 24 }}>
                {[
                    { l: "TOTAL ENCRYPTED", v: liveReqs.toLocaleString(), c: "#00F5D4", sub: "All time" },
                    { l: "THREATS BLOCKED", v: threats.toLocaleString(), c: "#FF3B3B", sub: "100% detection rate" },
                    { l: "STORAGE SAVED", v: "62%", c: "#10b981", sub: "Avg deduplication" },
                    { l: "UPTIME", v: `${uptime}%`, c: "#B9A7FF", sub: "Last 30 days" },
                    { l: "KEY ROTATIONS", v: keyRot.toLocaleString(), c: "#F59E0B", sub: "Session keys" },
                    { l: "AVG LATENCY", v: "11.2ms", c: "#00F5D4", sub: "24-hour avg" },
                ].map(m => (
                    <div key={m.l} className="card" style={{ padding: "18px 16px" }}>
                        <div style={{ fontSize: 7, color: "#88A3D6", letterSpacing: 2.5, marginBottom: 10 }}>{m.l}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: m.c, marginBottom: 4 }}>{m.v}</div>
                        <div style={{ fontSize: 8, color: "#88A3D6" }}>{m.sub}</div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>

                {/* 24h Latency */}
                <div className="card" style={{ padding: "26px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <SectionLabel>LATENCY · 24H ROLLING</SectionLabel>
                        <Tag color="#00F5D4">LIVE</Tag>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 100 }}>
                        {latData.map((d, i) => (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <div style={{
                                    width: "100%", borderRadius: "3px 3px 0 0",
                                    height: `${(d.v / maxLat) * 90}px`,
                                    background: d.v > 18 ? "linear-gradient(180deg,#FF3B3B,rgba(255,59,59,.3))" : d.v > 14 ? "linear-gradient(180deg,#F59E0B,rgba(245,158,11,.3))" : "linear-gradient(180deg,#00F5D4,rgba(0,245,212,.3))",
                                    boxShadow: i === latData.length - 1 ? "0 0 10px rgba(0,245,212,.5)" : "none",
                                    transition: "height .3s",
                                }} />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 8, color: "#88A3D6" }}>
                        <span>24H AGO</span>
                        <span style={{ color: "#00F5D4" }}>P50: 10ms · P95: 19ms · P99: 22ms</span>
                        <span>NOW</span>
                    </div>
                </div>

                {/* Weekly Volume */}
                <div className="card" style={{ padding: "26px" }}>
                    <SectionLabel>WEEKLY ENCRYPTION VOLUME</SectionLabel>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 110 }}>
                        {encData.map((d, i) => (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 8, color: "#88A3D6" }}>{d.v.toLocaleString()}</span>
                                <div style={{ width: "100%", borderRadius: "4px 4px 0 0", height: `${(d.v / maxEnc) * 80}px`, background: `linear-gradient(180deg,#B9A7FF,rgba(185,167,255,.25))`, boxShadow: "0 0 8px rgba(185,167,255,.2)", transition: "height .3s" }} />
                                <span style={{ fontSize: 8, color: "#88A3D6" }}>{d.d}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>

                {/* Storage Efficiency */}
                <div className="card" style={{ padding: "26px" }}>
                    <SectionLabel>STORAGE EFFICIENCY</SectionLabel>
                    {[
                        { l: "TRADITIONAL DB", pct: 100, c: "#FF3B3B" },
                        { l: "QUANTUM WALL", pct: 40, c: "#00F5D4" },
                    ].map(b => (
                        <div key={b.l} style={{ marginBottom: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                                <span style={{ fontSize: 9, color: "#88A3D6", letterSpacing: 1.5 }}>{b.l}</span>
                                <span style={{ fontSize: 10, fontWeight: 700, color: b.c }}>{b.pct}%</span>
                            </div>
                            <div style={{ height: 10, background: "rgba(255,255,255,.05)", borderRadius: 5, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${b.pct}%`, background: `linear-gradient(90deg,${b.c}55,${b.c})`, boxShadow: `0 0 10px ${b.c}44`, borderRadius: 5, transition: "width .8s" }} />
                            </div>
                        </div>
                    ))}
                    <div style={{ padding: "16px", background: "rgba(16,185,129,.07)", border: "1px solid rgba(16,185,129,.2)", borderRadius: 10, textAlign: "center" }}>
                        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: "#10b981" }}>60%</div>
                        <div style={{ fontSize: 9, color: "#88A3D6", letterSpacing: 2, marginTop: 4 }}>AVERAGE REDUCTION</div>
                    </div>
                </div>

                {/* Threat Log */}
                <div className="card cr" style={{ padding: "26px" }}>
                    <SectionLabel color="#FF3B3B">THREAT LOG</SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { time: "14:32:01", type: "MITM Attempt", city: "Moscow", blocked: true },
                            { time: "14:28:44", type: "Replay Attack", city: "Beijing", blocked: true },
                            { time: "14:21:17", type: "Key Probe", city: "Tehran", blocked: true },
                            { time: "14:15:03", type: "MITM Attempt", city: "Pyongyang", blocked: true },
                            { time: "14:09:52", type: "QKD Intercept", city: "Unknown", blocked: true },
                        ].map((t, i) => (
                            <div key={i} style={{ padding: "10px 12px", background: "rgba(255,59,59,.05)", border: "1px solid rgba(255,59,59,.12)", borderRadius: 9, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: 10, color: "#FF3B3B", marginBottom: 2 }}>{t.type}</div>
                                    <div style={{ fontSize: 8, color: "#88A3D6" }}>{t.city} · {t.time}</div>
                                </div>
                                <Tag color="#10b981">BLOCKED</Tag>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Algorithm Usage */}
                <div className="card cl" style={{ padding: "26px" }}>
                    <SectionLabel color="#B9A7FF">ALGORITHM USAGE</SectionLabel>
                    {[
                        { name: "AES-256-GCM + Q", pct: 68, c: "#00F5D4" },
                        { name: "ML-KEM (Kyber)", pct: 18, c: "#B9A7FF" },
                        { name: "ML-DSA (Dilithium)", pct: 9, c: "#10b981" },
                        { name: "SLH-DSA (SPHINCS+)", pct: 5, c: "#F59E0B" },
                    ].map(a => (
                        <div key={a.name} style={{ marginBottom: 18 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 10 }}>
                                <span style={{ color: "#E6E8EE" }}>{a.name}</span>
                                <span style={{ color: a.c, fontWeight: 700 }}>{a.pct}%</span>
                            </div>
                            <div style={{ height: 5, background: "rgba(255,255,255,.05)", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${a.pct}%`, background: `linear-gradient(90deg,${a.c}55,${a.c})`, borderRadius: 3, transition: "width .8s" }} />
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: 8, padding: "14px 16px", background: "rgba(0,0,0,.3)", borderRadius: 10, border: "1px solid var(--border)" }}>
                        <div style={{ fontSize: 9, color: "#88A3D6", letterSpacing: 2, marginBottom: 8 }}>NIST PQC STATUS</div>
                        {[["ML-KEM", "FINALIZED", "#10b981"], ["ML-DSA", "FINALIZED", "#10b981"], ["FALCON", "DRAFT", "#F59E0B"]].map(([n, s, c]) => (
                            <div key={n} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 9 }}>
                                <span style={{ color: "#88A3D6" }}>{n}</span><Tag color={c}>{s}</Tag>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
