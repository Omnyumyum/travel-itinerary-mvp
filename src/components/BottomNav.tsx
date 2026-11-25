import { CalendarDays, CheckSquare, ShieldAlert } from 'lucide-react';
import type { TabKey } from '../types';

interface BottomNavProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
  checklistBadge?: string;
}

const NAV_ITEMS: { key: TabKey; label: string; icon: typeof CalendarDays }[] = [
  { key: 'itinerary', label: '일정', icon: CalendarDays },
  { key: 'checklist', label: '체크리스트', icon: CheckSquare },
  { key: 'voucher', label: '바우처·SOS', icon: ShieldAlert },
];

export function BottomNav({ activeTab, onChangeTab, checklistBadge }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/50 pb-safe">
      <div className="h-16 grid grid-cols-3 px-2">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChangeTab(key)}
              className={`relative flex flex-col items-center justify-center gap-1 rounded-xl my-1 transition-colors cursor-pointer ${
                isActive
                  ? 'text-primary-container font-bold'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              <div
                className={`px-4 py-1 rounded-full transition-colors ${
                  isActive ? 'bg-primary-fixed' : 'bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] leading-none">{label}</span>
              {key === 'checklist' && checklistBadge && (
                <span className="absolute top-1.5 right-6 px-1.5 py-0.2 rounded-full bg-primary-container text-on-primary text-[9px] font-bold">
                  {checklistBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
