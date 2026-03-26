//app/components/Label.tsx

export default function Label({ children, className = '',  }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`text-md font-bold ${className}`}>
      {children}
    </span>
  );
}