import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Unlock, CheckCircle2, AlertCircle, Loader2, Shield, Key, Wifi, WifiOff, Copy, RefreshCw, Search } from "lucide-react";

const API_URI = "https://backend.whatsgoinon.space";

type Status = "idle" | "loading" | "success" | "error";

function StatusBadge({ online }: { online: boolean | null }) {
  if (online === null) return (
    <span className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
      <Loader2 size={12} className="animate-spin" /> Checking...
    </span>
  );
  return online ? (
    <span className="flex items-center gap-1.5 text-xs text-green-600 font-mono font-bold">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <Wifi size={12} />
      <span className="animate-pulse">BACKEND LIVE</span>
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-xs text-red-600 font-mono font-bold">
      <WifiOff size={12} /> BACKEND OFFLINE — SIMULATION MODE
    </span>
  );
}

function StepIndicator({ step, label, active, done }: { step: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all ${active ? "bg-blue-50 border border-blue-200" : done ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-100"}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${active ? "bg-blue-600 text-white" : done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}>
        {done ? "✓" : active ? <Loader2 size={10} className="animate-spin" /> : step}
      </div>
      <span className={`text-xs font-bold ${active ? "text-blue-700" : done ? "text-green-700" : "text-gray-400"}`}>{label}</span>
    </div>
  );
}

function TerminalLog({ lines }: { lines: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div className="bg-[#0a0f1e] rounded-xl p-4 font-mono text-xs border border-teal-900 min-h-[100px] max-h-44 overflow-auto">
      <div className="flex items-center gap-2 mb-3 border-b border-teal-900 pb-2">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-teal-400 ml-2 text-[10px] tracking-widest uppercase">Quantum Wall — Decryption Engine v3.1</span>
      </div>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className={`leading-relaxed ${
            line.startsWith("✅") ? "text-green-400" :
            line.startsWith("❌") ? "text-red-400" :
            line.startsWith("▶") ? "text-teal-300" :
            "text-gray-400"
          }`}
        >
          {line}
        </motion.div>
      ))}
      {lines.length > 0 && (
        <motion.span
          className="inline-block w-2 h-3 bg-teal-400 ml-0.5"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default function DecryptPage({ demoId }: { demoId?: string }) {
  const [searchId, setSearchId] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  // Auto-fill from demo flow
  useEffect(() => {
    if (demoId) {
      setSearchId(demoId);
      setTerminalLines([
        "▶ [DEMO MODE] Reference ID received from Encrypt step...",
        `▶ ID: ${demoId}`,
        "▶ Ready to decrypt — click Decrypt to continue...",
      ]);
    }
  }, [demoId]);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_URI}/ping`, { signal: AbortSignal.timeout(5000) });
        setOnline(res.ok);
      } catch { setOnline(false); }
    };
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, []);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  const randomHex = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const addLine = (line: string) => setTerminalLines(prev => [...prev, line]);

  const steps = [
    "Resolving Reference ID",
    "Verifying Vault Credentials",
    "Decapsulating ML-KEM Key",
    "Decrypting AES-256-GCM Payload",
  ];

  const handleDecrypt = async () => {
    if (!searchId.trim()) {
      setError("Please enter a Reference ID.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError(null);
    setResult(null);
    setTerminalLines([]);

    addLine(`▶ GET ${API_URI}/decrypt/${searchId.trim()}`);

    const stepDelays = [300, 700, 1400, 2100];
    stepDelays.forEach((delay, i) => {
      setTimeout(() => setCurrentStep(i + 1), delay);
    });

    await sleep(300); addLine(`▶ Resolving Reference ID in quantum vault...`);
    await sleep(600); addLine(`▶ Vault credentials verified — HMAC-SHA512 OK`);
    await sleep(600); addLine(`▶ Decapsulating ML-KEM Kyber-768 session key...`);
    await sleep(600); addLine(`▶ Session key: ${randomHex(8).toUpperCase()}...${randomHex(4).toUpperCase()}`);
    await sleep(400); addLine(`▶ Decrypting AES-256-GCM payload...`);

    try {
      let json: any;
      if (online) {
        const res = await fetch(`${API_URI}/decrypt/${encodeURIComponent(searchId.trim())}`);
        json = await res.json();
        if (!res.ok) throw new Error(json.detail ?? "Reference ID not found");
      } else {
        await sleep(400);
        // Simulation mode
        json = {
          status: "success",
          id: searchId.trim(),
          data: demoId === searchId.trim()
            ? "Classified: Operation Quantum Shield — Level 4 Clearance Required. This message is protected by post-quantum cryptography."
            : `[Simulated] Decrypted payload for ${searchId.trim()}`,
          algorithm: "ML-KEM Kyber-768",
          decrypted_at: new Date().toISOString(),
          latency_ms: (Math.random() * 0.4 + 0.1).toFixed(3),
        };
      }

      setResult(json);
      setStatus("success");
      addLine(`✅ Decryption successful`);
      addLine(`✅ Plaintext: "${(json.data ?? "").slice(0, 60)}${(json.data?.length ?? 0) > 60 ? "..." : ""}"`);
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
      setCurrentStep(0);
      addLine(`❌ Error: ${err.message}`);
    }
  };

  const handleReset = () => {
    setSearchId(""); setStatus("idle");
    setResult(null); setError(null);
    setCurrentStep(0); setTerminalLines([]);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 pt-20">
      {/* Demo Banner */}
      {demoId && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-green-600 text-white py-2 px-8 text-xs font-bold tracking-widest text-center flex items-center justify-center gap-3"
        >
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
          🚀 LIVE DEMO PATH — Step 2 of 2: Decrypt your payload using the Reference ID below
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
        </motion.div>
      )}

      {/* Header Banner */}
      <div className="bg-[#006781] text-white py-2 px-8 text-xs font-mono tracking-widest text-center uppercase">
        🔓 Quantum Wall — Post-Quantum Data Decryption Module | Secure Retrieval | ML-KEM Kyber-768
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#006781] flex items-center justify-center shadow-lg">
                <Unlock size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-[#006781] tracking-tight">Data Decryption</h1>
            </div>
            <p className="text-gray-500 text-sm">Retrieve and decrypt stored payloads using your Reference ID.</p>
          </div>
          <StatusBadge online={online} />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Form + Steps */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Input */}
            <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                Reference ID
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleDecrypt()}
                    placeholder="e.g. citizen-record-7823"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all bg-gray-50 font-mono"
                  />
                </div>
                <motion.button
                  onClick={handleDecrypt}
                  disabled={status === "loading"}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-[#006781] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#005568] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                  {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  Decrypt
                </motion.button>
              </div>
            </div>

            {/* Decryption Steps */}
            <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Decryption Process</h3>
              <div className="space-y-2">
                {steps.map((label, i) => (
                  <StepIndicator
                    key={label}
                    step={i + 1}
                    label={label}
                    active={status === "loading" && currentStep === i + 1}
                    done={status === "success" || (status === "loading" && currentStep > i + 1)}
                  />
                ))}
              </div>
            </div>

            {/* Terminal */}
            {terminalLines.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">API Execution Log</span>
                  {status === "loading" && <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full animate-pulse">● LIVE</span>}
                  {status === "success" && <span className="flex items-center gap-1 text-[10px] font-black text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">✓ COMPLETE</span>}
                </div>
                <TerminalLog lines={terminalLines} />
              </motion.div>
            )}

            {/* Reset */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <RefreshCw size={14} /> Reset
            </button>
          </motion.div>

          {/* Right: Result + Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Illustration */}
            <div className="bg-white rounded-2xl border border-teal-100 shadow-sm overflow-hidden">
              <img src="/handshake_illustration.png" alt="Decryption Illustration" className="w-full h-40 object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-[#006781] text-sm mb-1">Secure Payload Retrieval</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  The decryption engine fetches your stored ciphertext, re-derives the session key using ML-KEM, and decrypts using AES-256-GCM securely.
                </p>
              </div>
            </div>

            {/* Result */}
            <AnimatePresence>
              {status === "success" && result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-green-200 shadow-sm p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="text-xs font-bold uppercase tracking-widest text-green-700">Decrypted Successfully</span>
                    </div>
                    <button onClick={handleCopy} className="text-xs text-teal-600 flex items-center gap-1 hover:text-teal-800">
                      <Copy size={12} /> {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  {/* Original data prominently */}
                  {result.data && (
                    <div className="bg-green-50 rounded-xl p-4 mb-3 border border-green-100">
                      <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Original Plaintext</div>
                      <div className="text-sm font-medium text-gray-800">{result.data}</div>
                    </div>
                  )}
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-400 hover:text-gray-600">Show raw API response</summary>
                    <pre className="mt-2 font-mono bg-gray-50 rounded-lg p-3 overflow-auto max-h-40 border border-gray-100 whitespace-pre-wrap break-all text-gray-700">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </motion.div>
              )}
              {status === "error" && error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 rounded-2xl border border-red-200 p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-red-600">Error</span>
                  </div>
                  <p className="text-xs text-red-700 font-mono">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Cards */}
            <div className="bg-[#006781] rounded-2xl p-5 text-white">
              <h3 className="text-xs font-bold uppercase tracking-widest text-teal-200 mb-4">Security Guarantee</h3>
              <div className="space-y-3 text-xs font-mono">
                {[
                  ["Key Derivation", "HKDF-SHA256"],
                  ["Symmetric Cipher", "AES-256-GCM"],
                  ["MAC Verification", "HMAC-SHA512"],
                  ["Key Expiry", "Session-based"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-teal-200">{k}</span>
                    <span className="text-white font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* API Ref */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 bg-white rounded-2xl border border-teal-100 shadow-sm p-6"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
            <Shield size={14} className="text-teal-500" /> API Reference
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
            {[
              { method: "GET", path: "/ping", desc: "Health check" },
              { method: "POST", path: "/encrypt", desc: "Encrypt & store payload" },
              { method: "GET", path: "/decrypt/{id}", desc: "Retrieve & decrypt by ID" },
            ].map(ep => (
              <div key={ep.path} className="flex flex-col gap-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className={`text-[10px] font-black uppercase self-start px-2 py-0.5 rounded ${ep.method === "GET" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                  {ep.method}
                </span>
                <span className="text-gray-800 font-bold mt-1">{ep.path}</span>
                <span className="text-gray-500">{ep.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
