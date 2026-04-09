/**
 * AcademicConnect custom logo mark — an open book with a connecting arc above it,
 * symbolising knowledge and connection.
 */
export default function AcademicConnectLogo({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AcademicConnect logo"
    >
      {/* Open book pages */}
      <path
        d="M4 22V10C4 10 10 8 16 10C22 8 28 10 28 10V22C22 20 16 22 16 22C16 22 10 20 4 22Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Book spine */}
      <line x1="16" y1="10" x2="16" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Connection arc above book */}
      <path
        d="M10 9C10 6 13 4 16 4C19 4 22 6 22 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      {/* Connection dots */}
      <circle cx="10" cy="9" r="1.5" fill="white" />
      <circle cx="22" cy="9" r="1.5" fill="white" />
    </svg>
  );
}
