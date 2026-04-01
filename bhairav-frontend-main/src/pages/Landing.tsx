import { motion } from "framer-motion";
import { Shield, Lock, Zap, Activity, Cpu, Server, ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";

const FV = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

export default function Landing({ onLaunch, onStartDemo }: { onLaunch: () => void; onStartDemo: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-[#0b1c30]">

      {/* Hero Section */}
      <section className="border-b border-blue-100 overflow-hidden pt-24">
        <div className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial="hidden" animate="visible" variants={FV}
          >
            <motion.div variants={FV} custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-blue-700 tracking-widest uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Quantum Readiness Level: 4 — NIST Certified
            </motion.div>

            <motion.h1 variants={FV} custom={1}
              className="text-5xl lg:text-7xl font-black tracking-tighter text-[#0e1251] leading-[1.05]"
            >
              The Sentinel of<br />
              <span className="text-[#006781] italic">Your Data.</span>
            </motion.h1>

            <motion.p variants={FV} custom={2} className="text-xl text-gray-500 max-w-2xl leading-relaxed">
              Quantum-resistant encryption middleware designed for institutional trust. We leverage post-quantum cryptography to secure your legacy infrastructure against tomorrow's threats.
            </motion.p>

            <motion.div variants={FV} custom={3} className="flex flex-wrap gap-4 pt-2">
              <motion.button
                onClick={onLaunch}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#0e1251] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-[#1a2070] transition-colors"
              >
                Start Encrypting <ArrowRight size={16} />
              </motion.button>
              <motion.button
                onClick={onStartDemo}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-green-700 transition-colors relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 animate-pulse rounded-xl" />
                <span className="relative flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                  🚀 Try Live Demo
                </span>
              </motion.button>

            </motion.div>

            {/* Trust badges */}
            <motion.div variants={FV} custom={4} className="flex flex-wrap gap-3 pt-2">
              {["NIST FIPS 203", "ML-KEM Kyber-768", "ANU QRNG", "ISO 27001"].map(badge => (
                <span key={badge} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 shadow-sm">
                  <CheckCircle2 size={10} className="text-green-500" /> {badge}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Hero Image + Panel */}
          <motion.div
            className="lg:col-span-5 hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative rounded-3xl overflow-hidden border border-blue-100 shadow-xl bg-white">
              <img src="/hero_banner.png" alt="Quantum Encryption" className="w-full h-56 object-cover" />
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-gray-400 tracking-widest uppercase">
                  <span>Encryption Protocol</span>
                  <span className="flex items-center gap-1.5 text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Status: Active
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[{ icon: <Lock size={18} />, label: "Lock" }, { icon: <Activity size={18} />, label: "Hub" }, { icon: <CheckCircle2 size={18} />, label: "Key" }, { icon: <Cpu size={18} />, label: "Analytics" }].map(({ icon, label }) => (
                    <div key={label} className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0e1251] hover:bg-blue-100 transition-colors">
                      {icon}
                    </div>
                  ))}
                </div>
                <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                </div>
                <div className="text-xs text-gray-400 font-mono">Kyber-768 Active — 72% Quantum Resilience Score</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Certifications and Inspirations */}
      <section className="bg-[#0e1251] py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32">
          
          {/* NIST Certification */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-4xl md:text-5xl font-black text-white">NIST L3</div>
            <div className="text-xs text-blue-300 mt-2 uppercase tracking-widest font-bold">Security Certification</div>
          </motion.div>

          {/* Vertical Divider (Hidden on Mobile) */}
          <div className="hidden md:block w-px h-20 bg-blue-800/50"></div>

          {/* National Quantum Mission */}
          <motion.div
            className="text-center relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Simple animation effect: sweeping gradient or slow pulse mimicking Indian flag colors subtly */}
            <motion.div 
              className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 via-white/10 to-green-500/20 rounded-full blur-xl"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-white to-green-300">
                Inspired by NQM
              </div>
              <div className="text-xs text-blue-200 mt-2 uppercase tracking-widest font-bold max-w-xs mx-auto">
                National Quantum Mission of India
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Illustration Section */}
      <section className="py-24 bg-white border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src="/encrypt_illustration.png" alt="Post-Quantum Cryptography" className="w-full rounded-2xl shadow-lg border border-blue-100" />
          </motion.div>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 uppercase tracking-widest">
              Post-Quantum Ready
            </div>
            <h2 className="text-4xl font-black text-[#0e1251] tracking-tight">
              Post-Quantum Resilience Framework
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Systematic institutional security measures designed to withstand the next generation of cryptographic challenges. Built on NIST FIPS 203 draft standards with zero infrastructure changes required.
            </p>
            <div className="space-y-3">
              {["ML-KEM Kyber-768 lattice-based cryptography", "True quantum entropy from ANU QRNG", "Seamless zero-downtime migration"].map(feat => (
                <div key={feat} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  {feat}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-[#0e1251] tracking-tight mb-3">Three Pillars of Entropy</h2>
            <p className="text-gray-500 max-w-xl mx-auto">The cryptographic foundations that make Quantum Wall unbreakable.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { Icon: Activity, title: "True Quantum Entropy", desc: "Genuine non-deterministic entropy from the ANU quantum vacuum fluctuations — actual fabric-of-reality randomness, not pseudorandom algorithms.", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
              { Icon: Cpu, title: "ML-KEM Kyber-768", desc: "NIST-approved FIPS 203 lattice-based cryptography. Immune to Shor's algorithm and massive quantum-compute attacks.", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
              { Icon: Zap, title: "Hybrid Key Derivation", desc: "Merging ECC curves with lattice structures using HKDF-SHA256, protecting against both classical and quantum threat vectors simultaneously.", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
            ].map(({ Icon, title, desc, color, bg, border }, i) => (
              <motion.div
                key={title}
                className={`bg-white rounded-2xl border ${border} p-8 shadow-sm hover:shadow-md transition-shadow`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6`}>
                  <Icon size={28} className={color} />
                </div>
                <h3 className="text-xl font-black text-[#0e1251] mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Technical Specs */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-8">
          <h4 className="text-xs font-black text-[#006781] tracking-widest uppercase mb-8 text-center">Technical Specifications</h4>
          <div className="space-y-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {[
              ["Standard Implementation", "NIST FIPS 203 (Draft)"],
              ["Encryption Strength", "128-bit Post-Quantum"],
              ["Key Encapsulation", "ML-KEM Kyber-768"],
              ["Entropy Source", "ANU Quantum Random Number Generator"],
              ["Key Derivation", "HKDF-SHA256"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-6 py-4">
                <span className="font-medium text-[#0b1c30] text-sm">{k}</span>
                <span className="text-gray-500 text-sm font-bold font-mono">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div className="max-w-xs">
              <div className="text-xl font-black text-[#0e1251] uppercase tracking-widest mb-3">Quantum Wall</div>
              <p className="text-xs text-gray-500 leading-relaxed">Providing institutional-grade security for the next generation of digital infrastructure. Built on trust, powered by quantum mechanics.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-2 text-sm text-gray-500">
              <span className="font-bold text-[#0e1251] col-span-2 mb-1">Platform</span>
              {["Encryption", "Decryption", "Handshake", "Circuit Lab", "Analytics"].map(l => (
                <span key={l} className="hover:text-[#006781] cursor-pointer transition-colors">{l}</span>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <span>© 2026 Quantum Wall Security</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> All Systems Secure</span>
              <span className="font-mono">KYBER-768 ACTIVE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
