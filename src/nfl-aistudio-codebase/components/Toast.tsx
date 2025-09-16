import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { Notification } from '../types';

interface ToastProps {
  toast: Notification;
  onDismiss: () => void;
}

const icons = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const colors = {
    success: 'border-emerald-400/60 text-emerald-200',
    error: 'border-rose-400/60 text-rose-200',
    info: 'border-sky-400/60 text-sky-200',
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const Icon = icons[toast.tone];
  const colorClass = colors[toast.tone];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      role="status"
      className={`glass-pane pointer-events-auto flex w-full max-w-sm items-start gap-3 p-4 ${colorClass}`}
    >
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-bold text-gray-100">{toast.title}</p>
        <p className="text-sm opacity-90">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-lg leading-none transition hover:scale-110 text-gray-400 hover:text-white"
        aria-label="Dismiss notification"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

export default Toast;
