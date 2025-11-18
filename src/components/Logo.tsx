export default function Logo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-blue-600"
    >
      <rect x="10" y="20" width="25" height="60" rx="6" fill="#2563eb" />
      <rect x="45" y="20" width="45" height="60" rx="6" fill="#1e3a8a" />
    </svg>
  );
}
