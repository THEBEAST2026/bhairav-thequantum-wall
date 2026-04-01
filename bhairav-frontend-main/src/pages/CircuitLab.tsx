import { useState } from "react";
import { Btn, SectionLabel, Tag } from "@/components/QuantumUI";
import { rnd, hex, useInterval } from "@/lib/quantum-utils";
import { Button } from "@/components/ui/button";

export default function CircuitLab() {
    const [inputText, setInputText] = useState("Hello World");
    const [activeGate, setActiveGate] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const [step, setStep] = useState(0);
    const [results, setResults] = useState<{
        shots: number;
        counts: Record<string, number>;
        entropy: string;
        fidelity: string;
        depth: number;
        width: number;
        key_bits: string;
    } | null>(null);

    useInterval(() => { }, null);

    const nQ = Math.min(8, Math.max(2, Math.ceil(inputText.length / 2)));
    const gates = [
        { id: "h", label: "H", name: "Hadamard", color: "#014A94", desc: "Puts qubit into superposition." },
        { id: "cnot", label: "⊕", name: "CNOT", color: "#003366", desc: "Entangles two qubits." },
        { id: "m", label: "M", name: "Measure", color: "#F47920", desc: "Collapses superposition." },
    ];

    const runCircuit = () => {
        setRunning(true); setStep(0); setResults(null);
        let s = 0;
        const iv = setInterval(() => {
            s++; setStep(s);
            if (s >= 3) {
                clearInterval(iv); setRunning(false);
                setResults({
                    shots: 1024,
                    counts: { "00": 258, "01": 247, "10": 252, "11": 267 },
                    entropy: (97 + Math.random() * 3).toFixed(3),
                    fidelity: (98.5 + Math.random() * 1.4).toFixed(2),
                    depth: 3,
                    width: nQ,
                    key_bits: hex(32),
                });
            }
        }, 900);
    };

    const colX = [80, 180, 280];
    const wireH = 48;
    const svgH = nQ * wireH + 40;

    return (
        <div className="min-h-screen w-full bg-sky-100 text-[#333333] p-4 sm:p-8 pt-6 font-sans">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 border-b border-gray-300 pb-4">
                <h1 className="text-2xl sm:text-3xl font-black text-[#003366] tracking-tight">Qiskit Circuit Designer</h1>
                <p className="text-gray-700 text-sm mt-2 max-w-2xl leading-relaxed">
                    Enter text and watch the Qiskit circuit auto-generate. Run the circuit to simulate quantum key generation on the federal architecture.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left — Circuit Canvas */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Input bar */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row gap-6 items-center">
                        <div className="flex-1 w-full">
                            <label className="text-xs font-bold text-[#003366] uppercase tracking-wider mb-2 block">Payload Input</label>
                            <input
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2 text-[#333333] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#014A94]"
                            />
                        </div>
                        <div className="flex gap-6 items-end">
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#014A94]">{nQ}</div>
                                <div className="text-[10px] font-bold text-gray-500 tracking-widest">QUBITS</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#003366]">3</div>
                                <div className="text-[10px] font-bold text-gray-500 tracking-widest">DEPTH</div>
                            </div>
                            <Button onClick={runCircuit} disabled={running} className="bg-[#F47920] hover:bg-[#d66718] text-white font-bold px-6">
                                {running ? "RUNNING..." : "RUN CIRCUIT"}
                            </Button>
                        </div>
                    </div>

                    {/* SVG Circuit */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 overflow-x-auto">
                        <div className="text-xs font-bold text-[#003366] uppercase tracking-wider mb-6">Live Qiskit Circuit</div>
                        <svg width="100%" viewBox={`0 0 380 ${svgH}`} className="font-mono min-w-[340px]">
                            {Array.from({ length: nQ }, (_, i) => {
                                const y = i * wireH + wireH / 2 + 20;
                                const hActive = running && step >= 1;
                                const cActive = running && step >= 2;
                                const mActive = (running && step >= 3) || !!results;
                                return (
                                    <g key={i}>
                                        <line x1={25} y1={y} x2={340} y2={y} stroke="#CBD5E1" strokeWidth={1} />
                                        <text x={20} y={y + 4} fontSize={10} fill="#64748B" textAnchor="end">q{i}|0⟩</text>

                                        {/* H Gate */}
                                        <g onMouseEnter={() => setActiveGate("h")} onMouseLeave={() => setActiveGate(null)} style={{ cursor: "pointer" }}>
                                            <rect x={colX[0] - 16} y={y - 14} width={32} height={28} rx={4}
                                                fill={hActive ? "#014A94" : "#E2E8F0"} stroke="#014A94" strokeWidth={1.5} />
                                            <text x={colX[0]} y={y + 4} fontSize={12} fontWeight="bold" fill={hActive ? "white" : "#014A94"} textAnchor="middle">H</text>
                                        </g>

                                        {/* CNOT */}
                                        {i % 2 === 0 && i + 1 < nQ && (
                                            <g onMouseEnter={() => setActiveGate("cnot")} onMouseLeave={() => setActiveGate(null)} style={{ cursor: "pointer" }}>
                                                <line x1={colX[1]} y1={y} x2={colX[1]} y2={y + wireH} stroke="#003366" strokeWidth={1.5} strokeDasharray="3,2" />
                                                <circle cx={colX[1]} cy={y} r={5} fill="#003366" />
                                                <circle cx={colX[1]} cy={y + wireH} r={8} fill="none" stroke="#003366" strokeWidth={1.5} />
                                                <line x1={colX[1] - 8} y1={y + wireH} x2={colX[1] + 8} y2={y + wireH} stroke="#003366" strokeWidth={1.5} />
                                                <line x1={colX[1]} y1={y + wireH - 8} x2={colX[1]} y2={y + wireH + 8} stroke="#003366" strokeWidth={1.5} />
                                            </g>
                                        )}

                                        {/* Measure Gate */}
                                        <g onMouseEnter={() => setActiveGate("m")} onMouseLeave={() => setActiveGate(null)} style={{ cursor: "pointer" }}>
                                            <rect x={colX[2] - 16} y={y - 14} width={32} height={28} rx={4}
                                                fill={mActive ? "#F47920" : "#E2E8F0"} stroke="#F47920" strokeWidth={1.5} />
                                            <path d={`M${colX[2] - 8} ${y + 6} A8 8 0 0 1 ${colX[2] + 8} ${y + 6}`} stroke={mActive ? "white" : "#F47920"} strokeWidth={1.5} fill="none" />
                                            <line x1={colX[2]} y1={y + 6} x2={colX[2] + 6} y2={y - 3} stroke={mActive ? "white" : "#F47920"} strokeWidth={1.5} />
                                        </g>

                                        {/* Traveling qubit dot */}
                                        {running && (
                                            <circle r={4} fill="#F47920">
                                                <animateMotion dur={`${step * .8}s`} fill="freeze" path={`M25,0 L${colX[Math.min(step, 2)]},0`} />
                                            </circle>
                                        )}
                                    </g>
                                );
                            })}
                            <text x={colX[0]} y={10} fontSize={8} fill="#64748B" textAnchor="middle" fontWeight="bold">HADAMARD</text>
                            <text x={colX[1]} y={10} fontSize={8} fill="#64748B" textAnchor="middle" fontWeight="bold">ENTANGLEMENT</text>
                            <text x={colX[2]} y={10} fontSize={8} fill="#64748B" textAnchor="middle" fontWeight="bold">MEASURE</text>
                        </svg>
                    </div>

                    {/* Results */}
                    {results && (
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 border-t-4 border-t-[#014A94]">
                            <div className="text-xs font-bold text-[#003366] uppercase tracking-wider mb-6">Execution Results</div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                {[
                                    { l: "SHOTS", v: results.shots.toLocaleString(), c: "text-[#014A94]" },
                                    { l: "ENTROPY", v: `${results.entropy}%`, c: "text-[#003366]" },
                                    { l: "FIDELITY", v: `${results.fidelity}%`, c: "text-green-700" },
                                    { l: "DEPTH", v: String(results.depth), c: "text-gray-700" },
                                ].map(m => (
                                    <div key={m.l} className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className={`text-xl font-black ${m.c}`}>{m.v}</div>
                                        <div className="text-[10px] text-gray-500 font-bold tracking-widest mt-1">{m.l}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-xs font-bold text-[#003366] mb-3">MEASUREMENT HISTOGRAM</div>
                            <div className="flex gap-4 items-end h-32 border-b border-gray-300 pb-2 mb-6">
                                {Object.entries(results.counts).map(([k, v]) => (
                                    <div key={k} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="text-xs font-bold text-[#014A94]">{v}</span>
                                        <div className="w-full bg-[#014A94] rounded-t-sm transition-all duration-500" style={{ height: `${(v / 267) * 100}px` }} />
                                        <span className="text-[10px] font-bold text-gray-600">{k}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="text-xs font-bold text-[#003366] mb-2">GENERATED KEY BITS</div>
                            <div className="text-xs font-mono text-[#F47920] bg-orange-50 border border-orange-200 rounded p-3 break-all">
                                {results.key_bits}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                        <div className="text-xs font-bold text-[#003366] uppercase tracking-wider mb-4">Gate Reference</div>
                        {gates.map(g => (
                            <div key={g.id} className={`p-4 rounded-lg mb-3 border ${activeGate === g.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded bg-white border border-gray-300 flex items-center justify-center font-bold text-sm" style={{ color: g.color }}>{g.label}</div>
                                    <div>
                                        <div className="text-sm font-bold text-[#003366]">{g.name}</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-600 leading-relaxed">{g.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#003366] text-white rounded-lg shadow-sm p-6">
                        <div className="text-xs font-bold text-[#FFF8E1] uppercase tracking-wider mb-4">Quantum Advantage</div>
                        <div className="text-sm text-blue-100 leading-relaxed">
                            Classical RNGs use deterministic algorithms that can be predicted with enough compute. Quantum measurement outcomes are fundamentally non-deterministic.<br /><br />
                            This makes every key generated by Quantum Wall <span className="text-[#F47920] font-bold">provably random</span>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

void rnd;
