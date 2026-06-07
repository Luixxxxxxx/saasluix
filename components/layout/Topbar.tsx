interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>{title}</h1>
        {subtitle && <div className="date">{subtitle}</div>}
      </div>
      {actions && <div className="topbar-right">{actions}</div>}
    </div>
  );
}
