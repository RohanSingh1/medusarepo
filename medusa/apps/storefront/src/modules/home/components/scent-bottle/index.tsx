// Stand-in for real product photography (none exists yet for the new
// fragrance line) - a simple bottle silhouette rendered in each fragrance's
// own accent colour, on its own tint background with a soft glow behind it.
// Mirrors the AURA reference's own approach (it renders a stylised vector
// bottle rather than a photo too).
const ScentBottle = ({
  accent,
  tint,
  className = "",
}: {
  accent: string
  tint: string
  className?: string
}) => {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: tint }}
    >
      <div
        className="absolute h-2/3 w-2/3 rounded-full blur-2xl opacity-60"
        style={{ backgroundColor: accent }}
      />
      <svg
        viewBox="0 0 80 140"
        className="relative h-4/5 w-auto"
        aria-hidden="true"
      >
        <rect x="32" y="6" width="16" height="14" rx="3" fill={accent} />
        <rect
          x="24"
          y="20"
          width="32"
          height="10"
          rx="3"
          fill={accent}
          opacity="0.85"
        />
        <path
          d="M20 32 h40 a4 4 0 0 1 4 4 v92 a6 6 0 0 1 -6 6 h-36 a6 6 0 0 1 -6 -6 v-92 a4 4 0 0 1 4 -4 z"
          fill={accent}
        />
        <rect
          x="26"
          y="46"
          width="6"
          height="70"
          rx="3"
          fill="#fff"
          opacity="0.18"
        />
      </svg>
    </div>
  )
}

export default ScentBottle
