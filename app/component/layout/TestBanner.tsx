'use client';

import { Hammer, Mail, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function TestBanner() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/familles') ||
    pathname.startsWith('/ajout') ||
    pathname.startsWith('/import') ||
    pathname.startsWith('/export') ||
    pathname.startsWith('/association');

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="fixed bottom-0 right-0 z-[100]">
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-4 right-4 bg-[#00B074] p-3 rounded-full shadow-lg text-white hover:bg-[#009a66] transition-colors"
          aria-label="Afficher le widget de test"
        >
          <Hammer className="h-5 w-5" />
        </button>
      )}

      {isExpanded && (
        <div
          className={`fixed bottom-0 sm:bottom-4 right-0 sm:right-4 bg-white text-gray-800 rounded-t-lg sm:rounded-lg shadow-lg p-4 w-full sm:w-auto sm:max-w-sm border border-[#00B074] ${isDashboard ? 'md:ml-64' : ''} animate-fade-up`}
          role="dialog"
          aria-label="Widget de test"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 bg-[#00B074] text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  <Hammer className="h-4 w-4" />
                  En construction
                </span>
              </div>
              <h3 className="text-base font-semibold mb-1">Cette version est en test</h3>
              <p className="text-sm text-gray-600 mb-3 leading-snug">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Si vous constatez un bug ou avez une idée d'amélioration, n'hésitez pas à nous écrire !
              </p>
              <a
                href="mailto:fameasy.contact@gmail.com"
                className="inline-flex items-center gap-2 bg-[#00B074] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#009a66] transition"
              >
                <Mail className="h-4 w-4" />
                Nous contacter
              </a>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Fermer le widget"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
