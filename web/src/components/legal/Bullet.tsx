export function Bullet({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <li>
      {label && <strong>{label}:</strong>} {children}
    </li>
  );
}
