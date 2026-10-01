import type { UseFormRegisterReturn } from "react-hook-form";

/** Hidden from humans (and screen readers), irresistible to bots. */
export function Honeypot({ label, registration }: { label: string; registration: UseFormRegisterReturn }) {
  return (
    <div aria-hidden="true" className="absolute -start-[9999px] top-auto h-px w-px overflow-hidden">
      <label>
        {label}
        <input type="text" tabIndex={-1} autoComplete="off" {...registration} />
      </label>
    </div>
  );
}
