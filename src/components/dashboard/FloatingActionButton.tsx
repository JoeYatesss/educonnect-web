'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, type LucideIcon } from 'lucide-react';

interface FABAction {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
}

export default function FloatingActionButton({ actions }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div ref={fabRef} className="fixed bottom-6 right-6 z-50">
      {/* Backdrop overlay when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Action buttons - expand upward */}
      <div className="flex flex-col-reverse gap-3 mb-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isMailto = action.href?.startsWith('mailto:');

          return (
            <Link
              key={index}
              href={action.href || '#'}
              onClick={action.onClick}
              className={`
                flex items-center gap-3 bg-white rounded-full shadow-lg
                px-4 py-3 hover:shadow-xl transition-all duration-200
                ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
              `}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
              }}
              aria-label={action.label}
              {...(isMailto && { target: '_self' })}
            >
              <Icon className="w-5 h-5 text-brand-red" />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-red rounded-full shadow-lg hover:shadow-xl
                   flex items-center justify-center transition-all duration-200 hover:scale-110
                   focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
