interface HeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function Header({ title, action }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-6 py-4">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      {action && <div>{action}</div>}
    </header>
  );
}
