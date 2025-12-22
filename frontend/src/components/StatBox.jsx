export default function StatBox({ label, value }) {
  return (
    <div className="border rounded px-4 py-2">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
