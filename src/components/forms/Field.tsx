import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

type Props = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
};

export function Field({ id, label, error, children, className, required }: Props) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="ms-0.5 text-[#b42318]" aria-hidden>*</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#b42318]" role="alert">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function fieldA11y(id: string, error?: unknown) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}
