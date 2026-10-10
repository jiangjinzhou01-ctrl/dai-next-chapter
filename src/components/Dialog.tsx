import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { site } from '../data/site';

export function Dialog({ open, onClose, title, children, className = '' }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const focused = document.activeElement as HTMLElement | null;
    const previous = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.documentElement.style.overflow = previous;
      focused?.focus({ preventScroll: true });
    };
  }, [open]);
  return <dialog ref={ref} className={`dialog ${className}`} aria-label={title}
    onCancel={e => { e.preventDefault(); onClose(); }}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="dialog-body">
      <button className="icon-button dialog-close" onClick={onClose} aria-label={site.copy.ui.close}><X aria-hidden="true" /></button>
      {children}
    </div>
  </dialog>;
}
