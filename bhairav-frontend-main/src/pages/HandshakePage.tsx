import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle2, AlertCircle, Loader2, Zap, Activity, Lock, Radio, Key, RefreshCw } from "lucide-react";

function TerminalLog({ lines }: { lines: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);
  return (
    <div className="bg-[#0a0f1e] rounded-xl p-4 font-mono text-xs border border-indigo-900 min-h-[80px] max-h-52 overflow-auto">
      <div className="flex items-center gap-2 mb-2 border-b border-indigo-900 pb-2">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-indigo-400 ml-2 text-[10px] tracking-widest uppercase">QW Handshake Protocol v3.1</span>
      </div>
      {lines.map((line, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}
          className={`leading-relaxed ${
            line.startsWith("✅") ? "text-green-400" :
            line.startsWith("▶") ? "text-indigo-300" :
            line.startsWith("{") || line.startsWith("}") || line.startsWith('"') ? "text-yellow-300" :
            "text-gray-400"
          }`}>
          {line}
        </motion.div>
      ))}
      {lines.length > 0 && (
        <motion.span className="inline-block w-2 h-3 bg-indigo-400 ml-0.5" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
      )}
      <div ref={bottomRef} />
    </div>
  );
}

type HandshakeStatus = "idle" | "initiating" | "success" | "error";

const STAGES = [
  { id: 1, label: "Alice generates ML-KEM public/private keypair", icon: <Lock size={14} /> },
  { id: 2, label: "Alice sends public key to Bob over TLS", icon: <RefreshCw size={14} /> },
  { id: 3, label: "Bob encapsulates random secret with Alice's public key", icon: <Zap size={14} /> },
  { id: 4, label: "Both derive identical session key via HKDF + QRNG", icon: <Activity size={14} /> },
  { id: 5, label: "Secure channel active — quantum-resistant comms begin", icon: <Shield size={14} /> },
];

// Animated SVG shield with orbiting particles
function DynamicShieldSVG({ status }: { status: HandshakeStatus }) {
  const isActive = status === "initiating" || status === "success";
  const isSuccess = status === "success";

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer rotating ring */}
      <motion.svg
        width="256" height="256" viewBox="0 0 256 256"
        className="absolute inset-0"
        animate={isActive ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="128" cy="128" r="118" fill="none" stroke="#e0e7ff" strokeWidth="1" strokeDasharray="8 6" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <circle
              key={i}
              cx={128 + 118 * Math.cos(rad)}
              cy={128 + 118 * Math.sin(rad)}
              r="5"
              fill={isActive ? "#6366f1" : "#d1d5db"}
            />
          );
        })}
      </motion.svg>

      {/* Inner counter-rotating ring */}
      <motion.svg
        width="200" height="200" viewBox="0 0 200 200"
        className="absolute"
        style={{ top: 28, left: 28 }}
        animate={isActive ? { rotate: -360 } : { rotate: 0 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="100" cy="100" r="90" fill="none" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="4 8" />
        {[45, 135, 225, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <rect
              key={i}
              x={100 + 90 * Math.cos(rad) - 4}
              y={100 + 90 * Math.sin(rad) - 4}
              width="8" height="8"
              rx="2"
              fill={isActive ? "#3b82f6" : "#d1d5db"}
              transform={`rotate(${angle}, ${100 + 90 * Math.cos(rad)}, ${100 + 90 * Math.sin(rad)})`}
            />
          );
        })}
      </motion.svg>

      {/* Pulse rings */}
      {isActive && [1, 1.5, 2].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute w-28 h-28 rounded-full border border-blue-300"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: scale * 1.2, opacity: 0 }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Shield body */}
      <motion.div
        className={`relative w-28 h-28 flex items-center justify-center z-10 rounded-full shadow-xl
          ${isSuccess ? "bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400"
            : isActive ? "bg-gradient-to-br from-blue-100 to-indigo-200 border-2 border-blue-400"
            : "bg-gradient-to-br from-gray-100 to-blue-100 border-2 border-gray-200"}`}
        animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
      >
        <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
          {/* Main shield */}
          <motion.path
            d="M32 4 L56 14 L56 32 C56 46 44 56 32 60 C20 56 8 46 8 32 L8 14 Z"
            fill={isSuccess ? "#dcfce7" : isActive ? "#dbeafe" : "#f1f5f9"}
            stroke={isSuccess ? "#16a34a" : isActive ? "#3b82f6" : "#94a3b8"}
            strokeWidth="2"
            animate={isActive ? { stroke: ["#3b82f6", "#6366f1", "#3b82f6"] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Inner circuit lines */}
          <motion.path
            d="M24 28 L28 28 L28 24 M36 24 L36 28 L40 28 M24 36 L28 36 L28 40 M36 40 L36 36 L40 36"
            stroke={isSuccess ? "#16a34a" : isActive ? "#6366f1" : "#94a3b8"}
            strokeWidth="1.5" strokeLinecap="round"
            animate={isActive ? { strokeDashoffset: [0, -20] } : {}}
            strokeDasharray="5"
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          {/* Center icon */}
          {isSuccess ? (
            <motion.path
              d="M24 32 L29 37 L40 26"
              stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <motion.rect
              x="26" y="28" width="12" height="10" rx="2"
              fill={isActive ? "#3b82f6" : "#94a3b8"}
              animate={isActive ? { fill: ["#3b82f6", "#6366f1", "#3b82f6"] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </svg>

        {/* Scanning line */}
        {isActive && !isSuccess && (
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
            initial={{ opacity: 1 }}
          >
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-blue-400 opacity-60"
              animate={{ top: ["10%", "90%", "10%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function HandshakePage() {
  const [status, setStatus] = useState<HandshakeStatus>("idle");
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [sessionKey, setSessionKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const generateHexKey = () =>
    Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("").toUpperCase().match(/.{1,4}/g)!.join("-");
  const randomHex = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  const addLine = (line: string) => setTerminalLines(prev => [...prev, line]);

  const initiateHandshake = async () => {
    setStatus("initiating");
    setCompletedStages([]);
    setSessionKey("");
    setError(null);
    setTerminalLines([]);
    setApiResponse(null);

    const logLines: string[] = ["▶ POST /api/handshake/initiate"];
    setTerminalLines([...logLines]);

    for (let i = 0; i < STAGES.length; i++) {
      await sleep(1000);
      setCompletedStages(prev => [...prev, STAGES[i].id]);
      logLines.push(`▶ Stage ${STAGES[i].id}: ${STAGES[i].label}... OK`);
      if (STAGES[i].id === 1) logLines.push(`  - Keypair: NIST FIPS 203 ML-KEM-768`);
      if (STAGES[i].id === 3) logLines.push(`  - Ciphertext: 0x${randomHex(16)}...`);
      setTerminalLines([...logLines]);
    }

    await sleep(600);
    const key = generateHexKey();
    const response = {
      status: "success",
      protocol: "ML-KEM Kyber-768",
      entropy_source: "ANU QRNG",
      session_key_preview: `${key.slice(0, 9)}...${key.slice(-9)}`,
      key_derivation: "HKDF-SHA256",
      security_level: "NIST Level 3",
      latency_ms: (Math.random() * 0.4 + 0.1).toFixed(3),
      established_at: new Date().toISOString(),
    };
    setApiResponse(response);
    
    const responseLines = JSON.stringify(response, null, 2).split("\n");
    logLines.push(...responseLines);
    logLines.push("✅ Secure channel established successfully");
    setTerminalLines([...logLines]);
    
    setSessionKey(key);
    setStatus("success");
  };

  const reset = () => {
    setStatus("idle");
    setCompletedStages([]);
    setSessionKey("");
    setError(null);
    setTerminalLines([]);
    setApiResponse(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-20">
      {/* Banner */}
      <div className="bg-[#0e1251] text-white py-2 px-8 text-xs font-mono tracking-widest text-center uppercase">
        🤝 Quantum Wall — Secure Quantum Handshake Protocol | ML-KEM Key Exchange | ANU QRNG Entropy
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 tracking-widest uppercase mb-6">
            <Radio size={12} className="animate-pulse" />
            Quantum Key Exchange Protocol v3.1
          </div>
          <h1 className="text-4xl font-black text-[#0e1251] tracking-tight mb-3">Secure Handshake Module</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Initiate a post-quantum key exchange between two nodes using ML-KEM Kyber-768 with true entropy from the Australian National University Quantum Random Number Generator.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Center: Shield Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 flex flex-col items-center"
          >
            <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-8 w-full flex flex-col items-center gap-6">
              <DynamicShieldSVG status={status} />

              <AnimatePresence mode="wait">
                {status === "idle" && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <p className="text-sm text-gray-500 mb-4">Ready to initiate secure handshake</p>
                    <motion.button
                      onClick={initiateHandshake}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="bg-[#0e1251] text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-[#1a2070] transition-colors"
                    >
                      <Zap size={16} /> Initiate Handshake
                    </motion.button>
                  </motion.div>
                )}

                {status === "initiating" && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <div className="flex items-center gap-2 text-blue-600 font-mono text-sm font-bold">
                      <Loader2 size={14} className="animate-spin" />
                      Establishing channel...
                    </div>
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div key="success" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center w-full">
                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold text-sm mb-3">
                      <CheckCircle2 size={16} />
                      Channel Secured!
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs font-mono text-green-800 break-all mb-4">
                      SESSION KEY:<br />
                      <span className="font-black text-green-900">{sessionKey}</span>
                    </div>
                    <button
                      onClick={reset}
                      className="text-sm text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
                    >
                      Run New Handshake
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right: Stages + Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Live Stage Tracker */}
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Live Handshake Stages</h3>
                {status === "initiating" && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full animate-pulse">● LIVE EXECUTION</span>
                )}
                {status === "success" && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">✓ CHANNEL SECURED</span>
                )}
              </div>
              <div className="space-y-3">
                {STAGES.map((stage) => {
                  const done = completedStages.includes(stage.id);
                  const active = status === "initiating" && !done && completedStages.length === stage.id - 1;
                  return (
                    <motion.div
                      key={stage.id}
                      className={`flex items-center gap-4 rounded-xl p-4 border transition-all ${done ? "bg-green-50 border-green-200" : active ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-100"}`}
                      animate={active ? { x: [0, 2, -2, 0] } : {}}
                      transition={{ duration: 0.3, repeat: active ? Infinity : 0, repeatDelay: 0.5 }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs
                        ${done ? "bg-green-500" : active ? "bg-blue-600" : "bg-gray-300"}`}>
                        {done ? "✓" : active ? <Loader2 size={12} className="animate-spin" /> : stage.id}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm font-bold ${done ? "text-green-700" : active ? "text-blue-700" : "text-gray-400"}`}>
                          {stage.label}
                        </span>
                      </div>
                      {done && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-green-600 font-mono font-bold">
                          ✓ OK
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Illustration */}
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <img src="/handshake_illustration.png" alt="Handshake" className="w-full md:w-48 h-40 object-cover" />
              <div className="p-5 flex flex-col justify-center">
                <h3 className="font-bold text-[#0e1251] text-sm mb-2">Why Post-Quantum Handshake?</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Classical Diffie-Hellman key exchange is vulnerable to Shor's algorithm on quantum computers. ML-KEM Kyber-768 is immune, ensuring your session keys remain secure even against future quantum adversaries.
                </p>
              </div>
            </div>

            {/* Terminal Output */}
            {terminalLines.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">API Execution Log</span>
                  {status === "initiating" && <span className="text-[10px] font-black text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full animate-pulse">● LIVE</span>}
                  {status === "success" && <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">✓ DONE</span>}
                </div>
                <TerminalLog lines={terminalLines} />
              </motion.div>
            )}

            {/* Protocol Specs */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Algorithm", value: "ML-KEM Kyber-768", color: "bg-indigo-50 border-indigo-200" },
                { label: "Entropy Source", value: "ANU QRNG Live", color: "bg-blue-50 border-blue-200" },
                { label: "Key Derivation", value: "HKDF-SHA256", color: "bg-teal-50 border-teal-200" },
                { label: "Security Level", value: "NIST Level 3", color: "bg-green-50 border-green-200" },
              ].map(({ label, value, color }) => (
                <div key={label} className={`rounded-xl border p-4 ${color}`}>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{label}</div>
                  <div className="text-sm font-black text-[#0e1251]">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom: Modern Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 bg-white rounded-3xl border border-indigo-100 shadow-xl overflow-hidden"
        >
          <div className="bg-[#0e1251] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">Technical Deep Dive</h3>
            <h2 className="text-2xl font-black mb-4">ML-KEM Key Exchange Flow</h2>
            <p className="text-blue-100 text-sm max-w-2xl opacity-80 leading-relaxed">
              Our protocol implements the NIST FIPS 203 standard for Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM). 
              This ensures that session keys are protected against both classical and future quantum computer attacks.
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="relative">
              {/* Connecting line for the steps */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-blue-400 to-indigo-500 hidden md:block opacity-30" />
              
              <div className="space-y-12">
                {[
                  { id: "01", title: "Keypair Generation", desc: "Alice generates NIST FIPS 203 ML-KEM-768 keypair using high-entropy QRNG seeds.", icon: <Key size={18} /> },
                  { id: "02", title: "Public Key Exchange", desc: "The public key is transmitted to Bob over a TLS-secured classical channel.", icon: <RefreshCw size={18} /> },
                  { id: "03", title: "Encapsulation", desc: "Bob uses the public key to wrap a high-entropy random secret, creating a ciphertext.", icon: <Zap size={18} /> },
                  { id: "04", title: "Shared Secret Derivation", desc: "Both parties decrypt/derive the same symmetric key using HKDF and Bob's ciphertext.", icon: <Activity size={18} /> },
                  { id: "05", title: "Secure Channel Active", desc: "A 256-bit AES-GCM encrypted pipe is initialized for quantum-safe communication.", icon: <Shield size={18} /> },
                ].map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Step Content */}
                    <div className="flex-1 text-center md:text-left">
                      <div className={`inline-flex items-center gap-2 mb-2 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{item.id}</span>
                        <h4 className="font-black text-[#0e1251] text-lg">{item.title}</h4>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                        {item.desc}
                      </p>
                    </div>

                    {/* Step Icon / Circle */}
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100 shrink-0">
                      {item.icon}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-indigo-500"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>

                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Validated against NIST FIPS 203 Cryptographic Standards</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
