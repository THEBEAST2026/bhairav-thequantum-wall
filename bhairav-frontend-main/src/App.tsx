import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Unlock, Handshake, ChevronRight, Menu, X, Zap, Activity } from "lucide-react";
import Landing from "@/pages/Landing";
import EncryptPage from "@/pages/EncryptPage";
import DecryptPage from "@/pages/DecryptPage";
import HandshakePage from "@/pages/HandshakePage";
import CircuitLab from "@/pages/CircuitLab";
import HandshakeLoader from "@/pages/HandshakeLoader";

// ─── Navigation config ────────────────────────────────────────────────────────
const PAGES = [
  { id: "home",      label: "Platform",    icon: <Activity size={14} /> },
  { id: "encrypt",   label: "Encryption",  icon: <Lock size={14} /> },
  { id: "decrypt",   label: "Decryption",  icon: <Unlock size={14} /> },
  { id: "handshake", label: "Handshake",   icon: <Shield size={14} /> },
  { id: "circuit",   label: "Circuit Lab", icon: <Zap size={14} /> },
] as const;

type PageId = typeof PAGES[number]["id"];

export interface DemoState {
  id: string;
  text: string;
  active: boolean;
}

// ─── Light-Theme Government Nav ───────────────────────────────────────────────
function Nav({ page, setPage }: { page: PageId; setPage: (p: PageId) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-[200] bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      {/* Micro header */}
      <div className="bg-[#0e1251] text-white text-[10px] py-1 px-8 flex justify-between font-bold tracking-widest uppercase">
        <span>🔐 Secure Access Portal</span>
        <span>Secured by ML-KEM Kyber-768</span>
      </div>

      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => setPage("home")}
          className="text-[#0e1251] font-black text-xl tracking-widest hover:opacity-80 transition-opacity"
        >
          QUANTUM<span className="text-[#006781]">WALL</span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {PAGES.map(p => (
            <button
              key={p.id}
              onClick={() => setPage(p.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all tracking-wider ${
                page === p.id
                  ? "bg-[#0e1251] text-white shadow-sm"
                  : "text-gray-600 hover:bg-blue-50 hover:text-[#0e1251]"
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold font-mono">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> SYSTEM SECURE
          </div>
          <motion.button
            onClick={() => setPage("encrypt")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#0e1251] text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#1a2070] transition-colors"
          >
            <Lock size={12} /> Get Started
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#0e1251]"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-blue-100 overflow-hidden"
          >
            {PAGES.map(p => (
              <button
                key={p.id}
                onClick={() => { setPage(p.id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-left transition-colors ${
                  page === p.id ? "bg-blue-50 text-[#0e1251]" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p.icon} {p.label}
                <ChevronRight size={14} className="ml-auto" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<PageId>("home");
  const [showLoader, setShowLoader] = useState(false);

  // Demo state: carries pre-filled data from Landing → Encrypt → Decrypt
  const [demo, setDemo] = useState<DemoState>({ id: "", text: "", active: false });
  // Ciphertext bridge: Encrypt page stores the encrypted ID so Decrypt can auto-fill
  const [demoEncryptedId, setDemoEncryptedId] = useState<string>("");

  const handleLaunchConsole = () => setShowLoader(true);
  const handleLoaderComplete = () => { setShowLoader(false); setPage("handshake"); };

  // Called by Landing "Try Demo" button
  const handleStartDemo = () => {
    setDemo({
      id: "demo-citizen-7823",
      text: "Classified: Operation Quantum Shield — Level 4 Clearance Required. This message is protected by post-quantum cryptography.",
      active: true,
    });
    setPage("encrypt");
  };

  // Called by EncryptPage after successful encryption to hand off the ID to DecryptPage
  const handleDemoEncrypted = (id: string) => {
    setDemoEncryptedId(id);
  };

  // Called by EncryptPage "Copy & Go to Decrypt" button
  const handleGoToDecrypt = () => {
    setPage("decrypt");
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {showLoader && <HandshakeLoader onComplete={handleLoaderComplete} />}

      <div className={`relative z-10 flex flex-col min-h-screen transition-opacity duration-500 ${showLoader ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <Nav page={page} setPage={setPage} />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {page === "home"      && <motion.div key="home"      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><Landing onLaunch={handleLaunchConsole} onStartDemo={handleStartDemo} /></motion.div>}
            {page === "encrypt"   && <motion.div key="encrypt"   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><EncryptPage demo={demo} onDemoEncrypted={handleDemoEncrypted} onGoToDecrypt={handleGoToDecrypt} /></motion.div>}
            {page === "decrypt"   && <motion.div key="decrypt"   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><DecryptPage demoId={demoEncryptedId} /></motion.div>}
            {page === "handshake" && <motion.div key="handshake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><HandshakePage /></motion.div>}
            {page === "circuit"   && <motion.div key="circuit"   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><div className="pt-20"><CircuitLab /></div></motion.div>}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
