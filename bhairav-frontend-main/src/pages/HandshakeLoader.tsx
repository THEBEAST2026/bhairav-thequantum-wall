import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  "Fetching ANU QRNG entropy...",
  "Generating ML-KEM Kyber-768 keypair...",
  "Encapsulating shared secret...",
  "Deriving 256-bit session key via HKDF...",
  "Establishing secure channel...",
];

function DynamicSVGLoader({ progress }: { progress: number }) {
  const angle = (progress / 100) * 360;
  const r = 88;
  const cx = 110, cy = 110;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcX = cx + r * Math.sin(toRad(angle));
  const arcY = cy - r * Math.cos(toRad(angle));
  const largeArc = angle > 180 ? 1 : 0;
  const arcPath = `M ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${arcX} ${arcY}`;

  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" className="drop-shadow-lg">
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r} stroke="#e0e7ff" strokeWidth="6" />
      {/* Progress arc */}
      <motion.path
        d={arcPath}
        stroke="url(#progress-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Gradient */}
      <defs>
        <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Outer rotating dashes */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
        const rad = toRad(a);
        return (
          <motion.circle
            key={i}
            cx={cx + 102 * Math.sin(rad)}
            cy={cy - 102 * Math.cos(rad)}
            r="3"
            fill={i < Math.floor(progress / 8.4) ? "#6366f1" : "#e0e7ff"}
            animate={{ scale: i < Math.floor(progress / 8.4) ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.4 }}
          />
        );
      })}
      {/* Inner shield path */}
      <motion.path
        d="M110 68 L136 78 L136 96 C136 115 124 126 110 132 C96 126 84 115 84 96 L84 78 Z"
        fill="#eef2ff"
        stroke="#6366f1"
        strokeWidth="2"
        animate={{ stroke: progress >= 100 ? "#22c55e" : "#6366f1", fill: progress >= 100 ? "#dcfce7" : "#eef2ff" }}
        transition={{ duration: 0.5 }}
      />
      {/* Circuit lines inside shield */}
      <motion.path
        d="M100 99 L106 99 L106 93 M114 93 L114 99 L120 99 M100 107 L106 107 L106 113 M114 113 L114 107 L120 107"
        stroke={progress >= 100 ? "#16a34a" : "#6366f1"}
        strokeWidth="1.5" strokeLinecap="round"
        strokeDasharray="4" strokeDashoffset="0"
        animate={{ strokeDashoffset: [-20, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {/* Checkmark at 100% */}
      {progress >= 100 && (
        <motion.path
          d="M101 103 L107 109 L119 96"
          stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
      {/* Scanning line */}
      {progress < 100 && (
        <motion.line
          x1={cx - 22} x2={cx + 22}
          y1={0} y2={0}
          stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.5"
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          animate={{ y1: [87, 131, 87], y2: [87, 131, 87] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {/* Percentage in center */}
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="18" fontWeight="bold" fill={progress >= 100 ? "#16a34a" : "#1e40af"} fontFamily="monospace">
        {progress}%
      </text>
    </svg>
  );
}

export default function HandshakeLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stage = Math.floor((progress / 100) * STAGES.length);
    setStageIndex(Math.min(stage, STAGES.length - 1));

    if (progress === 100) {
      setTimeout(() => setDone(true), 300);
      setTimeout(() => onComplete(), 1200);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center z-[9999]">
      {/* Top banner */}
      <div className="absolute top-0 w-full bg-[#0e1251] text-white text-[10px] py-1.5 px-8 flex justify-between font-bold tracking-widest uppercase">
        <span>🔐 QUANTUM WALL — Government Security Portal</span>
        <span>Initializing Secure Session</span>
      </div>

      {/* Flash overlay on done */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-8 max-w-sm w-full px-6">
        {/* Logo */}
        <div className="text-2xl font-black text-[#0e1251] tracking-widest">
          QUANTUM<span className="text-[#006781]">WALL</span>
        </div>

        {/* SVG loader */}
        <DynamicSVGLoader progress={progress} />

        {/* Stage message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="text-sm font-bold text-[#0e1251] font-mono">
              {progress >= 100 ? "✅ Secure Channel Established!" : STAGES[stageIndex]}
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              Stage {Math.min(stageIndex + 1, STAGES.length)} of {STAGES.length}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        {/* Log entries */}
        <div className="w-full bg-white border border-blue-100 rounded-xl p-4 font-mono text-xs space-y-1 shadow-sm max-h-28 overflow-hidden">
          {STAGES.slice(0, stageIndex + 1).map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-gray-600"
            >
              <span className="text-green-500">›</span> {s.replace("...", "")}
              <span className="ml-auto text-green-400">{i < stageIndex ? "OK" : "..."}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
