/** Lucide glyphs used by the Chapter Hub, inlined at 2px stroke. */

type Props = { size?: number; className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function FeedIcon({ size = 18 }: Props) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

export function UsersIcon({ size = 18 }: Props) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function ClipboardIcon({ size = 18 }: Props) {
  return (
    <svg {...base} width={size} height={size}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}

export function PlusIcon({ size = 16 }: Props) {
  return (
    <svg {...base} strokeWidth={2.5} width={size} height={size}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export function LinkIcon({ size = 15 }: Props) {
  return (
    <svg {...base} width={size} height={size} style={{ flexShrink: 0 }}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function TrashIcon({ size = 16 }: Props) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export function CloseIcon({ size = 18 }: Props) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function CheckIcon({ size = 22 }: Props) {
  return (
    <svg {...base} strokeWidth={2.5} width={size} height={size}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 18 }: Props) {
  return (
    <svg {...base} width={size} height={size} stroke="var(--slate-400)">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function LogOutIcon({ size = 16 }: Props) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

export function PencilIcon({ size = 16 }: Props) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
