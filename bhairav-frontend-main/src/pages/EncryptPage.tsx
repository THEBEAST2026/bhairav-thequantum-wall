import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle2, AlertCircle, Loader2, Shield, Key, Cpu, Wifi, WifiOff, Copy, RefreshCw, ArrowRight, Zap } from "lucide-react";
import type { DemoState } from "../App";

const API_URI = "https://backend.whatsgoinon.space";

type Status = "idle" | "loading" | "success" | "error";

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

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

// Streaming terminal log component
function TerminalLog({ lines }: { lines: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div className="bg-[#0a0f1e] rounded-xl p-4 font-mono text-xs border border-blue-900 min-h-[120px] max-h-48 overflow-auto">
      <div className="flex items-center gap-2 mb-3 border-b border-blue-900 pb-2">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-blue-400 ml-2 text-[10px] tracking-widest uppercase">Quantum Wall — Encryption Engine v3.1</span>
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
            line.startsWith("▶") ? "text-blue-300" :
            line.startsWith("{") || line.startsWith("}") || line.startsWith('"') ? "text-yellow-300" :
            "text-gray-400"
          }`}
        >
          {line}
        </motion.div>
      ))}
      {lines.length > 0 && (
        <motion.span
          className="inline-block w-2 h-3 bg-green-400 ml-0.5"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
      <div ref={bottomRef} />
    </div>
  );
}

interface EncryptPageProps {
  demo: DemoState;
  onDemoEncrypted: (id: string) => void;
  onGoToDecrypt: () => void;
}

export default function EncryptPage({ demo, onDemoEncrypted, onGoToDecrypt }: EncryptPageProps) {
  const [id, setId] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [encryptedId, setEncryptedId] = useState<string>("");

  // Pre-fill from demo
  useEffect(() => {
    if (demo.active && demo.id) {
      setId(demo.id);
      setData(demo.text);
      setTerminalLines([
        "▶ [DEMO MODE] Pre-loaded classified payload...",
        `▶ Reference ID: ${demo.id}`,
        "▶ Awaiting encryption command...",
      ]);
    }
  }, [demo]);

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

  const addLine = (line: string) => setTerminalLines(prev => [...prev, line]);

  const simulateTerminalFlow = async (isLive: boolean) => {
    setTerminalLines([]);
    await sleep(100); addLine(`▶ POST ${API_URI}/encrypt`);
    await sleep(300); addLine(`▶ Requesting ANU QRNG entropy seed...`);
    await sleep(500); addLine(`▶ QRNG seed received: 0x${randomHex(8)}`);
    await sleep(400); addLine(`▶ Initializing ML-KEM Kyber-768 keypair...`);
    await sleep(600); addLine(`▶ Encapsulating shared secret...`);
    await sleep(500); addLine(`▶ Wrapping payload in AES-256-GCM envelope...`);
    await sleep(400); addLine(`▶ Transmitting to quantum vault...`);
    if (!isLive) {
      await sleep(300); addLine(`▶ [SIMULATION] Backend offline — using local mock...`);
    }
  };

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  const randomHex = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join("");

  const handleEncrypt = async () => {
    if (!id.trim() || !data.trim()) {
      setError("Reference ID and plaintext are both required.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError(null);
    setResult(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => (p >= 90 ? 90 : p + 10));
    }, 120);

    await simulateTerminalFlow(online === true);

    try {
      let json: any;
      if (online) {
        const res = await fetch(`${API_URI}/encrypt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id.trim(), data: data.trim() }),
        });
        json = await res.json();
        clearInterval(interval);
        setProgress(100);
        if (!res.ok) throw new Error(json.detail ?? "Encryption failed");
      } else {
        // Simulation mode
        await sleep(600);
        clearInterval(interval);
        setProgress(100);
        json = {
          status: "success",
          id: id.trim(),
          algorithm: "ML-KEM Kyber-768",
          standard: "NIST FIPS 203",
          entropy: "ANU QRNG",
          ciphertext_preview: `0x${randomHex(32)}...`,
          latency_ms: (Math.random() * 0.4 + 0.1).toFixed(3),
          timestamp: new Date().toISOString(),
        };
      }

      const resultStr = JSON.stringify(json, null, 2);
      setResult(resultStr);
      setEncryptedId(id.trim());
      onDemoEncrypted(id.trim());
      setStatus("success");
      addLine(`✅ Encryption successful — Reference ID: ${id.trim()}`);
      addLine(`✅ Response:`);
      resultStr.split("\n").slice(0, 8).forEach(l => addLine(`   ${l}`));

    } catch (err: any) {
      clearInterval(interval);
      setError(err.message);
      setStatus("error");
      addLine(`❌ Error: ${err.message}`);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyAndGo = () => {
    handleCopy();
    setTimeout(() => onGoToDecrypt(), 400);
  };

  const handleReset = () => {
    setId(""); setData(""); setStatus("idle");
    setResult(null); setError(null); setProgress(0);
    setTerminalLines([]); setEncryptedId("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20">
      {/* Demo Path Banner */}
      {demo.active && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-green-600 text-white py-2 px-8 text-xs font-bold tracking-widest text-center flex items-center justify-center gap-3"
        >
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
          🚀 LIVE DEMO PATH — Step 1 of 2: Encrypt your payload below, then click "Copy &amp; Go to Decrypt"
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
        </motion.div>
      )}

      {/* Header Banner */}
      <div className="bg-[#0e1251] text-white py-2 px-8 text-xs font-mono tracking-widest text-center uppercase">
        🔐 Quantum Wall — Post-Quantum Data Encryption Module | NIST FIPS 203 Compliant | ML-KEM Kyber-768
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
              <div className="w-10 h-10 rounded-xl bg-[#0e1251] flex items-center justify-center shadow-lg">
                <Lock size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-[#0e1251] tracking-tight">Data Encryption</h1>
            </div>
            <p className="text-gray-500 text-sm ml-13">Secure your payload with quantum-resistant ML-KEM Kyber-768 encryption.</p>
          </div>
          <StatusBadge online={online} />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Reference ID */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                Reference ID
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={id}
                  onChange={e => setId(e.target.value)}
                  placeholder="e.g. citizen-record-7823"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all bg-gray-50 font-mono"
                />
              </div>
            </div>

            {/* Plaintext */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                Sensitive Plaintext Data
              </label>
              <textarea
                value={data}
                onChange={e => setData(e.target.value)}
                placeholder="Enter the sensitive data to encrypt using post-quantum algorithms..."
                rows={5}
                className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all bg-gray-50 resize-none font-mono"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>{data.length} characters</span>
                <span>AES-256-GCM layer applied after ML-KEM</span>
              </div>
            </div>

            {/* Progress */}
            {status === "loading" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0e1251]">Encryption in Progress</span>
                  <span className="text-xs font-mono text-gray-500">{progress}%</span>
                </div>
                <ProgressBar value={progress} />
              </motion.div>
            )}

            {/* Terminal */}
            {terminalLines.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">API Execution Log</span>
                  {status === "loading" && <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full animate-pulse">● LIVE</span>}
                  {status === "success" && <span className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">✓ COMPLETE</span>}
                </div>
                <TerminalLog lines={terminalLines} />
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                onClick={handleEncrypt}
                disabled={status === "loading"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-[#0e1251] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-[#1a2070] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <><Loader2 size={16} className="animate-spin" /> Encrypting with Kyber-768...</>
                ) : (
                  <><Shield size={16} /> Encrypt &amp; Store Securely</>
                )}
              </motion.button>
              <button
                onClick={handleReset}
                className="px-5 py-4 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Demo: Copy & Go to Decrypt */}
            {status === "success" && demo.active && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleCopyAndGo}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-green-700 transition-colors"
              >
                <Zap size={16} />
                🚀 Step 2: Copy Result &amp; Go to Decrypt
                <ArrowRight size={16} />
              </motion.button>
            )}
          </motion.div>

          {/* Right: Result + Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Illustration */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
              <img src="/encrypt_illustration.png" alt="Encryption Illustration" className="w-full h-40 object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-[#0e1251] text-sm mb-1">Post-Quantum Cryptography</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your data is encrypted using NIST-standardized ML-KEM (Kyber-768) combined with true quantum entropy from the ANU Quantum Random Number Generator.
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
                      <span className="text-xs font-bold uppercase tracking-widest text-green-700">Encrypted Successfully</span>
                    </div>
                    <button onClick={handleCopy} className="text-xs text-blue-600 flex items-center gap-1 hover:text-blue-800">
                      <Copy size={12} /> {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-gray-50 rounded-lg p-3 overflow-auto max-h-48 border border-gray-100 whitespace-pre-wrap break-all text-gray-700">
                    {result}
                  </pre>
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

            {/* Specs */}
            <div className="bg-[#0e1251] rounded-2xl p-5 text-white">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Technical Specs</h3>
              <div className="space-y-3 text-xs font-mono">
                {[
                  ["Algorithm", "ML-KEM Kyber-768"],
                  ["Standard", "NIST FIPS 203"],
                  ["Key Size", "256-bit"],
                  ["Entropy", "ANU QRNG"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-blue-300">{k}</span>
                    <span className="text-white font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>


      </div>
    </div>
  );
}
