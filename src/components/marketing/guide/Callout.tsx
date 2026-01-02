import { AlertCircle, CheckCircle, Info } from 'lucide-react';

type CalloutType = 'info' | 'warning' | 'success';

interface CalloutProps {
  type: CalloutType;
  title: string;
  children: React.ReactNode;
}

export default function Callout({ type, title, children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-500 text-blue-900',
    warning: 'bg-red-50 border-red-500 text-red-900',
    success: 'bg-green-50 border-green-500 text-green-900',
  };

  const icons = {
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
  };

  return (
    <div className={`my-6 p-5 rounded-lg border-l-4 ${styles[type]}`}>
      <div className="flex items-center gap-2 font-semibold mb-2">
        {icons[type]}
        {title}
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
