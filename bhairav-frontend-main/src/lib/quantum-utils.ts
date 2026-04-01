import { useRef, useEffect } from "react";

export function rnd(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function hex(n = 1): string {
  return Array.from({ length: n }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  )
    .join("")
    .toUpperCase();
}

export function useInterval(cb: () => void, ms: number | null) {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  }, [cb]);
  useEffect(() => {
    if (!ms) return;
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [ms]);
}
