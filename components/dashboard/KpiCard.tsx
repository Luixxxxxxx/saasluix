type Variant = "positive" | "negative" | "neutral" | "result";
type ValueColor = "green" | "red" | "white";

interface KpiCardProps {
  variant: Variant;
  label: string;
  icon: React.ReactNode;
  value: string;
  valueColor: ValueColor;
  children?: React.ReactNode;
}

export default function KpiCard({
  variant,
  label,
  icon,
  value,
  valueColor,
  children,
}: KpiCardProps) {
  return (
    <div className={`kpi-card ${variant}`}>
      <div className="kpi-label">
        {icon}
        {label}
      </div>
      <div className={`kpi-value ${valueColor}`}>{value}</div>
      {children}
    </div>
  );
}
