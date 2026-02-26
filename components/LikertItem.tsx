'use client';

import type { AssessmentItem } from '@/lib/types';

interface LikertItemProps {
  item: AssessmentItem;
  value: number | undefined;
  onChange: (id: string, value: number) => void;
  locale: string;
  scale1Label: string;
  scale5Label: string;
}

export default function LikertItem({
  item,
  value,
  onChange,
  locale,
  scale1Label,
  scale5Label,
}: LikertItemProps) {
  const label = locale === 'he' ? item.labelHe : item.labelEn;

  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      <p className="text-base font-semibold text-gray-800 mb-4">{label}</p>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xs text-gray-400 w-16 text-end hidden sm:block">{scale1Label}</span>
        <div className="flex gap-2 sm:gap-3 flex-1 justify-center">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(item.id, n)}
              aria-label={`${n}`}
              className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 font-semibold text-sm
                transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                ${
                  value === n
                    ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-md'
                    : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:scale-105'
                }
              `}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 w-16 hidden sm:block">{scale5Label}</span>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2 px-0 sm:px-20">
        <span className="sm:hidden">{scale1Label}</span>
        <span className="sm:hidden">{scale5Label}</span>
      </div>
    </div>
  );
}
