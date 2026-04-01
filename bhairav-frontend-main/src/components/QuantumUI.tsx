import { useRef, CSSProperties, ReactNode } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const COLORS = {
    teal: { bg: "rgba(0,245,212,.1)", border: "rgba(0,245,212,.4)", text: "#00F5D4", glow: "rgba(0,245,212,.3)" },
    lilac: { bg: "rgba(185,167,255,.1)", border: "rgba(185,167,255,.4)", text: "#B9A7FF", glow: "rgba(185,167,255,.3)" },
    red: { bg: "rgba(255,59,59,.08)", border: "rgba(255,59,59,.45)", text: "#FF3B3B", glow: "rgba(255,59,59,.35)" },
    ghost: { bg: "transparent", border: "rgba(255,255,255,.1)", text: "#88A3D6", glow: "transparent" },
} as const;

// ─── Btn ──────────────────────────────────────────────────────────────────────
interface BtnProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: keyof typeof COLORS;
    style?: CSSProperties;
    disabled?: boolean;
    full?: boolean;
}

export function Btn({ children, onClick, variant = "teal", style: s = {}, disabled, full }: BtnProps) {
    const c = COLORS[variant];
    const ref = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || !ref.current) return;
        const btn = ref.current;
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.28;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.28;
        btn.style.transform = `translate(${dx}px,${dy}px)`;
    };

    const handleMouseLeave = () => {
        if (ref.current) {
            ref.current.style.transform = "translate(0,0)";
            ref.current.style.boxShadow = "none";
        }
    };

    return (
        <button
            ref={ref}
            onClick={onClick}
            disabled={disabled}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => { if (!disabled && ref.current) ref.current.style.boxShadow = `0 0 28px ${c.glow},0 0 8px ${c.glow}`; }}
            onMouseLeave={handleMouseLeave}
            style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: 9,
                color: c.text,
                fontSize: 11,
                letterSpacing: 1.5,
                cursor: disabled ? "default" : "pointer",
                fontFamily: "'JetBrains Mono',monospace",
                padding: "9px 22px",
                transition: "transform 0.15s ease, box-shadow 0.25s ease",
                opacity: disabled ? 0.45 : 1,
                width: full ? "100%" : undefined,
                position: "relative",
                ...s,
            }}
        >
            {children}
        </button>
    );
}

// ─── Tag ──────────────────────────────────────────────────────────────────────
export function Tag({ children, color = "#00F5D4" }: { children: ReactNode; color?: string }) {
    return (
        <span
            style={{
                fontSize: 8,
                padding: "3px 9px",
                background: `${color}14`,
                border: `1px solid ${color}33`,
                borderRadius: 4,
                color,
                letterSpacing: 1.5,
            }}
        >
            {children}
        </span>
    );
}

// ─── Dot ──────────────────────────────────────────────────────────────────────
export function Dot({ color = "#10b981", pulse }: { color?: string; pulse?: boolean }) {
    return (
        <div
            style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 7px ${color}`,
                animation: pulse ? "pulse 2s infinite" : "none",
                flexShrink: 0,
            }}
        />
    );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────
export function SectionLabel({ children, color = "var(--teal)" }: { children: ReactNode; color?: string }) {
    return (
        <div
            style={{
                fontSize: 9,
                color,
                letterSpacing: 3.5,
                marginBottom: 16,
                fontFamily: "'JetBrains Mono',monospace",
            }}
        >
            {children}
        </div>
    );
}
