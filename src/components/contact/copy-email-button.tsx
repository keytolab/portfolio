"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies the address to the clipboard and confirms it in place (and to screen readers). */
export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Older browsers / blocked clipboard: fall back to a temporary selection.
      const input = document.createElement("input");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium text-ink ring-1 ring-white/20 transition-colors duration-300 hover:bg-white/[0.06]"
    >
      {copied ? (
        <Check aria-hidden className="size-4 text-[#ffd60a]" strokeWidth={2} />
      ) : (
        <Copy aria-hidden className="size-4" strokeWidth={2} />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
