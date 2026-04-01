import { motion } from "framer-motion";

export default function AnimatedShield({ className = "" }: { className?: string }) {
  // Enhanced hexagon with circuitry lines and deep quantum theme
  return (
    <div className={`relative flex items-center justify-center ${className} group cursor-pointer duration-500`}>
      {/* Outer blurred glow */}
      <div className="absolute inset-0 bg-neon-cyan/20 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <motion.svg 
        viewBox="0 0 200 200" 
        className="w-full h-full relative z-10 drop-shadow-2xl overflow-visible"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#b026ff" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="shieldFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#010D17" />
            <stop offset="100%" stopColor="#021A2F" />
          </linearGradient>
          <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit 1 */}
        <motion.ellipse 
          cx="100" cy="100" rx="80" ry="30" 
          fill="none" 
          stroke="rgba(0, 243, 255, 0.3)" 
          strokeWidth="1"
          style={{ transformOrigin: 'center', rotate: 45 }}
        />
        <motion.circle 
          r="3" fill="#00f3ff" filter="url(#neon)"
          style={{ transformOrigin: 'center', rotate: 45 }}
          animate={{ x: [20, 180, 20], y: [100, 100, 100] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Orbit 2 */}
        <motion.ellipse 
          cx="100" cy="100" rx="80" ry="30" 
          fill="none" 
          stroke="rgba(176, 38, 255, 0.3)" 
          strokeWidth="1"
          style={{ transformOrigin: 'center', rotate: -45 }}
        />

        {/* Outer Ring */}
        <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 6" className="animate-dash" />

        {/* Main Hexagon Shield */}
        <motion.polygon 
          points="100,20 170,55 170,145 100,180 30,145 30,55" 
          fill="url(#shieldFill)" 
          stroke="url(#shieldGrad)" 
          strokeWidth="3"
          className="transition-all duration-500 group-hover:neon-glow-cyan"
          whileHover={{ scale: 1.05 }}
        />

        {/* Inner Circuitry Lines */}
        <path d="M100 20 L100 100 M170 55 L100 100 M170 145 L100 100 M30 55 L100 100 M30 145 L100 100" stroke="rgba(0, 243, 255, 0.2)" strokeWidth="2" />
        <circle cx="100" cy="100" r="15" fill="none" stroke="#00f3ff" strokeWidth="2" filter="url(#neon)" />
        <circle cx="100" cy="100" r="8" fill="#b026ff" filter="url(#neon)" />
      </motion.svg>
    </div>
  );
}
