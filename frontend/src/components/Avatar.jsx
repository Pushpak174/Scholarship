export default function Avatar({ name, size = 64 }) {
  // Get initials (P or PM)
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full
                 bg-gradient-to-br from-indigo-500 to-purple-600
                 text-white font-semibold shadow"
    >
      <span style={{ fontSize: size / 2 }}>
        {initials}
      </span>
    </div>
  );
}
