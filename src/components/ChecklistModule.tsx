import { useState, useMemo } from 'react';
import { Plus, Trash2, Check, ListChecks } from 'lucide-react';
import type { ChecklistCategory, ChecklistItem } from '../types';

interface ChecklistModuleProps {
  items: ChecklistItem[];
  onAdd: (text: string, category: ChecklistCategory) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

type FilterType = '전체' | ChecklistCategory;

export function ChecklistModule({
  items,
  onAdd,
  onToggle,
  onDelete,
}: ChecklistModuleProps) {
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<ChecklistCategory>('준비물');
  const [filter, setFilter] = useState<FilterType>('전체');
  const [inputError, setInputError] = useState('');

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems = useMemo(() => {
    if (filter === '전체') return items;
    return items.filter((item) => item.category === filter);
  }, [items, filter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newText.trim();
    if (!trimmed) {
      setInputError('체크리스트 항목 내용을 입력해 주세요.');
      return;
    }
    const isDuplicate = items.some(
      (item) => item.text.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setInputError('이미 등록된 동일한 항목이 있습니다.');
      return;
    }
    setInputError('');
    onAdd(trimmed, newCategory);
    setNewText('');
  };

  return (
    <div className="space-y-4">
      {/* Progress Card */}
      <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <ListChecks className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-on-surface">
                투어 준비 및 인원 체크
              </h2>
              <p className="text-[11px] text-on-surface-variant">
                총 {totalCount}개 중 {completedCount}개 완료
              </p>
            </div>
          </div>

          <span className="text-[20px] font-bold text-primary-container">
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-container transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </section>

      {/* Add Item Form */}
      <section className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-xs border border-outline-variant/40">
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="flex items-center gap-1.5">
            {(['준비물', '출석'] as ChecklistCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setNewCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                  newCategory === cat
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => {
                setNewText(e.target.value);
                if (inputError) setInputError('');
              }}
              placeholder="새 준비물 또는 인원 체크 항목 입력..."
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
            <button
              type="submit"
              className="px-3.5 py-2.5 rounded-xl bg-primary-container text-on-primary text-[13px] font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
          </div>
          {inputError && (
            <p className="text-[12px] font-medium text-error">{inputError}</p>
          )}
        </form>
      </section>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        {(['전체', '준비물', '출석'] as FilterType[]).map((f) => {
          const count =
            f === '전체'
              ? items.length
              : items.filter((i) => i.category === f).length;
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${
                active
                  ? 'bg-on-surface text-surface-container-lowest'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/50'
              }`}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      {/* Checklist Items */}
      <section className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl bg-surface-container-lowest p-6 text-center text-[13px] text-on-surface-variant border border-outline-variant/40">
            표시할 체크리스트 항목이 없습니다.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 rounded-2xl bg-surface-container-lowest p-3.5 shadow-xs border transition-all ${
                item.completed
                  ? 'border-outline-variant/30 opacity-80'
                  : 'border-outline-variant/50'
              }`}
            >
              <button
                type="button"
                onClick={() => onToggle(item.id)}
                aria-label={`${item.text} 체크 토글`}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                  item.completed
                    ? 'bg-primary-container border-primary-container text-on-primary'
                    : 'border-outline-variant bg-surface-container-lowest hover:border-primary-container'
                }`}
              >
                {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              <div
                onClick={() => onToggle(item.id)}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      item.category === '출석'
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                        : 'bg-primary-fixed text-on-primary-fixed'
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
                <p
                  className={`text-[14px] font-semibold break-keep ${
                    item.completed
                      ? 'line-through text-outline'
                      : 'text-on-surface'
                  }`}
                >
                  {item.text}
                </p>
                {item.memo && (
                  <p className="text-[12px] text-on-surface-variant mt-0.5 break-keep">
                    {item.memo}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onDelete(item.id)}
                aria-label="항목 삭제"
                className="p-1.5 rounded-lg text-outline hover:bg-error-container hover:text-error transition-colors shrink-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
