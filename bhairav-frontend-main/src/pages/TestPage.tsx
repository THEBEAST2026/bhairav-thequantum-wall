import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle2, AlertCircle, Lock, Unlock, Activity, Wifi, WifiOff } from "lucide-react"

const API_URI = "https://backend.whatsgoinon.space"

// ─── Backend Status ───────────────────────────────────────────────────────────
type BackendStatus = "checking" | "online" | "offline"

function BackendBadge({ status }: { status: BackendStatus }) {
  const cfg = {
    checking: { icon: <Loader2 size={13} className="animate-spin" />, label: "Checking backend...", cls: "border-gray-300 text-gray-600 bg-white" },
    online: { icon: <Wifi size={13} />, label: "backend.whatsgoinon.space — LIVE", cls: "border-green-300 text-green-700 bg-green-50" },
    offline: { icon: <WifiOff size={13} />, label: "Backend unreachable", cls: "border-red-300 text-red-700 bg-red-50" },
  }[status]

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded border shadow-sm text-xs font-mono ${cfg.cls}`}>
      {cfg.icon}
      <span className="font-semibold">{cfg.label}</span>
    </div>
  )
}

// ─── Response View ────────────────────────────────────────────────────────────
interface FormState { loading: boolean; result: string | null; error: string | null }

function ResponseView({ state, color }: { state: FormState; color: string }) {
  const isError = color === "red"
  return (
    <div className={`mt-4 rounded border p-3 bg-gray-50 ${isError ? "border-red-200" : "border-gray-200"}`}>
      <div className="flex items-center gap-2 mb-2">
        {isError
          ? <AlertCircle size={14} className="text-red-500" />
          : <CheckCircle2 size={14} className="text-green-600" />}
        <span className={`text-xs font-bold uppercase tracking-wide ${isError ? "text-red-600" : "text-green-700"}`}>
          {isError ? "Error" : "Response"}
        </span>
      </div>
      <pre className="text-xs text-gray-700 font-mono overflow-auto whitespace-pre-wrap break-words border border-gray-100 bg-white p-2 rounded">
        {state.error ?? state.result}
      </pre>
    </div>
  )
}

// ─── Encrypt Form ─────────────────────────────────────────────────────────────
function EncryptForm() {
  const [qubitId, setQubitId] = useState("")
  const [payload, setPayload] = useState("")
  const [state, setState] = useState<FormState>({ loading: false, result: null, error: null })

  const handleEncrypt = async () => {
    if (!qubitId.trim() || !payload.trim()) {
      setState({ loading: false, result: null, error: "ID and Text are required." })
      return
    }
    setState({ loading: true, result: null, error: null })
    try {
      const res = await fetch(`${API_URI}/encrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: qubitId, data: payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? "Encryption failed")
      setState({ loading: false, result: JSON.stringify(data, null, 2), error: null })
    } catch (err: any) {
      setState({ loading: false, result: null, error: err.message })
    }
  }

  return (
    <Card className="border-gray-200 bg-white shadow-sm hover:shadow transition-shadow">
      <CardHeader>
        <CardTitle className="text-[#003366] flex items-center gap-2">
          <Lock size={18} className="text-[#014A94]" /> Encrypt Data
        </CardTitle>
        <CardDescription className="text-gray-500">
          POST <code className="text-gray-700 bg-gray-100 px-1 py-0.5 rounded">/encrypt</code> — stores encrypted payload against an ID
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="font-bold text-gray-700">Reference ID</Label>
          <Input
            placeholder="e.g. secret-123"
            value={qubitId}
            onChange={e => setQubitId(e.target.value)}
            className="border-gray-300 focus:border-[#014A94] focus:ring-[#014A94]/20"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-bold text-gray-700">Plaintext to Encrypt</Label>
          <Textarea
            placeholder="Enter sensitive data..."
            value={payload}
            onChange={e => setPayload(e.target.value)}
            rows={3}
            className="border-gray-300 focus:border-[#014A94] focus:ring-[#014A94]/20"
          />
        </div>
        <Button className="w-full bg-[#014A94] hover:bg-[#003366] text-white font-bold" onClick={handleEncrypt} disabled={state.loading}>
          {state.loading ? <><Loader2 size={15} className="mr-2 animate-spin" /> Encrypting...</> : "Encrypt & Store"}
        </Button>
        {state.result && <ResponseView state={state} color="emerald" />}
        {state.error && <ResponseView state={state} color="red" />}
      </CardContent>
    </Card>
  )
}

// ─── Decrypt Form ─────────────────────────────────────────────────────────────
function DecryptForm() {
  const [searchId, setSearchId] = useState("")
  const [state, setState] = useState<FormState>({ loading: false, result: null, error: null })

  const handleDecrypt = async () => {
    if (!searchId.trim()) {
      setState({ loading: false, result: null, error: "Please enter an ID." })
      return
    }
    setState({ loading: true, result: null, error: null })
    try {
      const res = await fetch(`${API_URI}/decrypt/${encodeURIComponent(searchId)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? "ID not found")
      setState({ loading: false, result: JSON.stringify(data, null, 2), error: null })
    } catch (err: any) {
      setState({ loading: false, result: null, error: err.message })
    }
  }

  return (
    <Card className="border-gray-200 bg-white shadow-sm hover:shadow transition-shadow">
      <CardHeader>
        <CardTitle className="text-[#003366] flex items-center gap-2">
          <Unlock size={18} className="text-[#F47920]" /> Decrypt Data
        </CardTitle>
        <CardDescription className="text-gray-500">
          GET <code className="text-gray-700 bg-gray-100 px-1 py-0.5 rounded">/decrypt/&#123;id&#125;</code> — retrieves and decrypts stored payload
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="font-bold text-gray-700">Reference ID</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. secret-123"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleDecrypt()}
              className="border-gray-300 focus:border-[#F47920] focus:ring-[#F47920]/20"
            />
            <Button className="bg-[#F47920] hover:bg-[#d66718] text-white font-bold" onClick={handleDecrypt} disabled={state.loading}>
              {state.loading ? <Loader2 size={15} className="animate-spin" /> : "Decrypt"}
            </Button>
          </div>
        </div>
        {state.result && <ResponseView state={state} color="indigo" />}
        {state.error && <ResponseView state={state} color="red" />}
      </CardContent>
    </Card>
  )
}

// ─── Endpoint Reference Card ──────────────────────────────────────────────────
function EndpointRef() {
  const endpoints = [
    { method: "GET", path: "/ping", desc: "Health check — returns { message: 'pong' }" },
    { method: "POST", path: "/encrypt", desc: "Body: { id, data } — encrypts & stores" },
    { method: "GET", path: "/decrypt/{item_id}", desc: "Retrieves & decrypts by reference ID" },
  ]
  return (
    <Card className="border-gray-200 bg-gray-50 shadow-sm">
      <CardHeader className="py-3 px-4 border-b border-gray-200">
        <CardTitle className="text-[#003366] flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <Activity size={16} /> API Endpoints Reference
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 px-4">
        <div className="space-y-3">
          {endpoints.map(ep => (
            <div key={ep.path} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-mono">
              <span className={`shrink-0 px-2 py-1 rounded-sm text-[10px] uppercase font-bold text-center w-12 ${
                  ep.method === "GET" ? "bg-green-100 text-green-700 border border-green-200" : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}>{ep.method}</span>
              <span className="text-gray-800 font-bold bg-white px-2 py-1 border border-gray-200 rounded">{ep.path}</span>
              <span className="text-gray-500 text-xs sm:text-[10px] leading-tight font-sans">{ep.desc}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-500 mt-4 font-mono font-semibold bg-white px-2 py-1 inline-block border border-gray-200 rounded">
          Base URL: {API_URI}
        </p>
      </CardContent>
    </Card>
  )
}

// ─── TestPage ────────────────────────────────────────────────────────────────
export default function TestPage() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking")

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_URI}/ping`, { signal: AbortSignal.timeout(5000) })
        setBackendStatus(res.ok ? "online" : "offline")
      } catch {
        setBackendStatus("offline")
      }
    }
    check()
    const id = setInterval(check, 30_000) // re-check every 30s
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w-full bg-sky-100 text-[#333333] p-4 sm:p-8 pt-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#003366] tracking-tight">Console API Interface</h1>
            <p className="text-gray-600 text-sm mt-1 font-medium">Verify quantum-secured payload encryption against the live federal backend</p>
          </div>
          <BackendBadge status={backendStatus} />
        </div>

        {/* Endpoint reference */}
        <EndpointRef />

        {/* Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EncryptForm />
          <DecryptForm />
        </div>
      </div>
    </div>
  )
}