
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full scale-150"></div>
        <div className="relative w-20 h-20 rounded-3xl bg-[#121220] border border-gray-800 flex items-center justify-center text-cyan-400 shadow-xl">
          <Icon size={40} />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-8">{description}</p>
      {actionLabel && (
        <button 
          onClick={onAction}
          className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-sm font-bold transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
