'use client';

interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export default function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div className={`flex items-start gap-3 border rounded-lg px-4 py-3 mb-4 ${styles[type]}`}>
      <span className="flex-1 text-sm">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-lg leading-none opacity-60 hover:opacity-100">&times;</button>
      )}
    </div>
  );
}
