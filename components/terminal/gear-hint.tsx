/** Hand-drawn "accent" note with a looping arrow down onto the settings gear. */
export function GearHint() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -top-[74px] right-1 h-[80px] w-[140px] text-acc max-[700px]:hidden">
      <span className="absolute top-0 left-0 -rotate-6 font-mono text-[12px]">accent</span>
      <svg width="140" height="80" viewBox="0 0 140 80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M58 10 C76 2 98 4 96 20 C94 34 76 32 82 20 C88 8 120 14 124 36 C126 50 124 62 123 74" />
        <path d="M117 67 L123 75 L129 67" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
