import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/** Thin React wrappers over the BSP design system's core.css classes. */

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      {...props}
      className={`bsp-btn bsp-btn--${variant} bsp-btn--${size} ${className}`}
    />
  );
}

export function IconButton({
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { size?: "sm" | "md" | "lg" }) {
  return (
    <button
      {...props}
      className={`bsp-iconbtn bsp-iconbtn--${size} ${className}`}
    />
  );
}

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "neutral"
  | "success"
  | "danger"
  | "outline";

export function Badge({
  variant = "neutral",
  children,
  className = "",
}: {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`bsp-badge bsp-badge--${variant} ${className}`}>
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`bsp-card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="bsp-field-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? (
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: "var(--muted-foreground)",
          }}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`bsp-input ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className={`bsp-textarea ${props.className ?? ""}`} />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`bsp-select ${props.className ?? ""}`} />;
}

export function Avatar({
  initials,
  size = "md",
}: {
  initials: string;
  size?: "sm" | "md";
}) {
  return (
    <span className={`bsp-avatar bsp-avatar--${size}`} aria-hidden="true">
      {initials}
    </span>
  );
}

/** Empty state: dashed outline, matching the prototype's "No posts" block. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        border: "1px dashed var(--slate-300)",
        borderRadius: 16,
        color: "var(--muted-foreground)",
        fontSize: 15,
      }}
    >
      {children}
    </div>
  );
}

/** The stat grid used on report cards — hairline dividers over --border. */
export function StatGrid({
  stats,
  min = 110,
}: {
  stats: { label: string; value: string }[];
  min?: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`,
        gap: 1,
        background: "var(--border)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: "#fff",
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
            {s.label}
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Inline error, styled like the prototype's overdue callout. */
export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      style={{
        padding: "12px 16px",
        borderRadius: 12,
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.25)",
        fontSize: 14,
        color: "#b91c1c",
      }}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  sub,
  actions,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  actions?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1
          style={{
            margin: "6px 0 0",
            fontFamily: "var(--font-heading)",
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
        {sub ? (
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 15,
              color: "var(--muted-foreground)",
            }}
          >
            {sub}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
