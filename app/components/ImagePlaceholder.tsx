import React from "react";

interface ImagePlaceholderProps {
  /** What image should go here, e.g. "Hero art Umamusume" */
  label: string;
  /** Optional secondary hint (dimensi, mood, dsb.) */
  note?: string;
  /** Material Symbols icon name */
  icon?: string;
  className?: string;
}

/**
 * Visual stand-in for an image that hasn't been generated yet.
 * Shows a labelled image icon so it's obvious where real art belongs.
 * Fills its parent — give the parent the desired size / aspect ratio.
 */
export default function ImagePlaceholder({
  label,
  note,
  icon = "add_photo_alternate",
  className = "",
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder gambar: ${label}`}
      className={`group relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary-soft via-white to-accent/10 p-6 text-center ${className}`}
    >
      <span className="material-symbols-outlined !text-5xl text-primary/70 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <span className="text-sm font-bold text-ink/70">{label}</span>
      {note ? <span className="text-xs font-medium text-ink/40">{note}</span> : null}
      <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
        gambar
      </span>
    </div>
  );
}
