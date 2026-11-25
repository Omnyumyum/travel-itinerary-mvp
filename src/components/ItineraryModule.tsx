import { useState, useMemo } from 'react';
import {
  Plus,
  CheckCircle2,
  Clock,
  CircleDot,
  Pencil,
  Trash2,
  X,
  Check,
  MapPin,
  Plane,
  Utensils,
  BedDouble,
  Camera,
} from 'lucide-react';
import type {
  DayNumber,
  ItineraryCategory,
  ItineraryItem,
  ItineraryStatus,
  TripMeta,
} from '../types';
import { hasUnsafeHtml, sanitizePlainText } from '../utils/sanitize';

interface ItineraryModuleProps {
  items: ItineraryItem[];
  tripMeta: TripMeta;
  onAdd: (item: Omit<ItineraryItem, 'id'>) => void;
  onUpdate: (item: ItineraryItem) => void;
  onDelete: (id: string) => void;
}

const DAYS: DayNumber[] = [1, 2, 3];
const CATEGORIES: ItineraryCategory[] = ['이동', '관광', '식사', '숙소'];
const STATUS_ORDER: ItineraryStatus[] = ['예정', '진행 중', '완료'];

const CATEGORY_STYLE: Record<
  ItineraryCategory,
  { badge: string; icon: typeof Plane }
> = {
  이동: { badge: 'bg-blue-50 text-blue-700 border-blue-200/70', icon: Plane },
  관광: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/70', icon: Camera },
  식사: { badge: 'bg-orange-50 text-orange-700 border-orange-200/70', icon: Utensils },
  숙소: { badge: 'bg-violet-50 text-violet-700 border-violet-200/70', icon: BedDouble },
};

const STATUS_STYLE: Record<
  ItineraryStatus,
  { pill: string; node: string; icon: typeof Clock }
> = {
  완료: {
    pill: 'bg-surface-container text-on-surface-variant border-outline-variant/60',
    node: 'bg-secondary-container text-on-secondary-fixed',
    icon: CheckCircle2,
  },
  '진행 중': {
    pill: 'bg-primary-container text-on-primary border-primary-container shadow-xs',
    node: 'bg-primary-container text-on-primary ring-4 ring-primary-fixed',
    icon: CircleDot,
  },
  예정: {
    pill: 'bg-surface-container-low text-primary border-primary-fixed',
    node: 'bg-surface-container-lowest text-outline border-2 border-outline-variant',
    icon: Clock,
  },
};

export function ItineraryModule({
  items,
  tripMeta,
  onAdd,
  onUpdate,
  onDelete,
}: ItineraryModuleProps) {
  const [selectedDay, setSelectedDay] = useState<DayNumber>(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);

  const [formDay, setFormDay] = useState<DayNumber>(1);
  const [formTime, setFormTime] = useState('09:00');
  const [formPlace, setFormPlace] = useState('');
  const [formCategory, setFormCategory] = useState<ItineraryCategory>('관광');
  const [formMemo, setFormMemo] = useState('');
  const [formStatus, setFormStatus] = useState<ItineraryStatus>('예정');
  const [formError, setFormError] = useState('');

  const dayItems = useMemo(() => {
    return items
      .filter((it) => it.day === selectedDay)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [items, selectedDay]);

  const completedCount = dayItems.filter((it) => it.status === '완료').length;
  const progressPct =
    dayItems.length > 0 ? Math.round((completedCount / dayItems.length) * 100) : 0;

  const openAddModal = () => {
    setEditingItem(null);
    setFormDay(selectedDay);
    setFormTime('10:00');
    setFormPlace('');
    setFormCategory('관광');
    setFormMemo('');
    setFormStatus('예정');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (item: ItineraryItem) => {
    setEditingItem(item);
    setFormDay(item.day);
    setFormTime(item.time);
    setFormPlace(item.place);
    setFormCategory(item.category);
    setFormMemo(item.memo);
    setFormStatus(item.status);
    setFormError('');
    setModalOpen(true);
  };

  const handleToggleStatus = (item: ItineraryItem) => {
    const idx = STATUS_ORDER.indexOf(item.status);
    const nextStatus = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    onUpdate({ ...item, status: nextStatus });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPlace = formPlace.trim();
    const trimmedMemo = formMemo.trim();
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(formTime)) {
      setFormError('올바른 시간(HH:MM)을 입력해 주세요.');
      return;
    }
    if (!trimmedPlace) {
      setFormError('장소명 또는 일정 제목을 입력해 주세요.');
      return;
    }
    if (trimmedPlace.length > 60) {
      setFormError('장소명은 60자 이내로 입력해 주세요.');
      return;
    }
    if (hasUnsafeHtml(trimmedPlace) || hasUnsafeHtml(trimmedMemo)) {
      setFormError('HTML 태그나 script 코드는 입력할 수 없습니다.');
      return;
    }
    setFormError('');
    const safePlace = sanitizePlainText(trimmedPlace);
    const safeMemo = sanitizePlainText(trimmedMemo);
    if (editingItem) {
      onUpdate({
        ...editingItem,
        day: formDay,
        time: formTime,
        place: safePlace,
        category: formCategory,
        memo: safeMemo,
        status: formStatus,
      });
    } else {
      onAdd({
        day: formDay,
        time: formTime,
        place: safePlace,
        category: formCategory,
        memo: safeMemo,
        status: formStatus,
      });
      setSelectedDay(formDay);
    }
    setModalOpen(false);
  };

  const dayMeta = tripMeta.dayLabels[selectedDay];

  return (
    <div className="space-y-4">
      {/* Day Tabs & Add Button */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-surface-container gap-1 flex-1">
            {DAYS.map((day) => {
              const active = selectedDay === day;
              const label = tripMeta.dayLabels[day];
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 py-2 px-1 rounded-lg text-[12px] flex flex-col items-center justify-center transition-all cursor-pointer ${
                    active
                      ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface font-medium'
                  }`}
                >
                  <span>{label.title}</span>
                  <span
                    className={`text-[10px] ${
                      active ? 'text-on-primary/90' : 'text-outline'
                    }`}
                  >
                    {label.dateLabel}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="h-12 px-3.5 rounded-xl bg-surface-container-lowest text-primary-container border border-primary-fixed text-[12px] font-bold shadow-xs hover:bg-primary-fixed/40 flex items-center gap-1 shrink-0 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>일정 추가</span>
          </button>
        </div>

        {/* Active Day Summary */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface-variant">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-primary-container shrink-0" />
            <span className="text-[12px] font-medium truncate">
              {dayMeta.summary}
            </span>
          </div>
          <span className="text-[11px] text-primary-container font-bold shrink-0 ml-2">
            {dayItems.length}개 일정 · {progressPct}%
          </span>
        </div>
      </section>

      {/* Vertical Timeline */}
      <section className="relative w-full pt-1">
        {dayItems.length === 0 ? (
          <div className="rounded-2xl bg-surface-container-lowest p-8 text-center border border-outline-variant/40 shadow-xs space-y-3">
            <p className="text-[14px] font-semibold text-on-surface">
              Day {selectedDay}에 등록된 일정이 없습니다.
            </p>
            <p className="text-[12px] text-on-surface-variant">
              우측 상단의 &apos;+ 일정 추가&apos; 버튼으로 새 일정을 등록하세요.
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-primary-container text-on-primary text-[13px] font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              첫 일정 추가하기
            </button>
          </div>
        ) : (
          <>
            <div className="absolute left-[18px] top-6 bottom-6 w-0.5 bg-surface-container-highest" />
            <div className="space-y-3.5">
              {dayItems.map((item) => {
                const catStyle = CATEGORY_STYLE[item.category];
                const CatIcon = catStyle.icon;
                const statusStyle = STATUS_STYLE[item.status];
                const StatusIcon = statusStyle.icon;

                return (
                  <div key={item.id} className="relative flex items-start gap-3">
                    {/* Node Pip */}
                    <div
                      className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-2 transition-all ${statusStyle.node}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                    </div>

                    {/* Schedule Card */}
                    <div
                      className={`flex-1 min-w-0 bg-surface-container-lowest rounded-2xl p-4 shadow-xs border transition-all ${
                        item.status === '진행 중'
                          ? 'border-primary-container/60 ring-2 ring-primary-fixed/60'
                          : 'border-outline-variant/40'
                      } ${item.status === '완료' ? 'opacity-85' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[16px] font-bold text-on-surface tracking-tight">
                            {item.time}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold inline-flex items-center gap-1 ${catStyle.badge}`}
                          >
                            <CatIcon className="w-3 h-3" />
                            {item.category}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          title="클릭하여 상태 변경 (예정 → 진행 중 → 완료)"
                          className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold inline-flex items-center gap-1 shrink-0 active:scale-95 transition-all cursor-pointer ${statusStyle.pill}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {item.status}
                        </button>
                      </div>

                      <h3
                        className={`text-[15px] font-bold text-on-surface mb-1 break-keep ${
                          item.status === '완료' ? 'line-through decoration-outline/60' : ''
                        }`}
                      >
                        {item.place}
                      </h3>

                      {item.memo && (
                        <p className="text-[12.5px] text-on-surface-variant leading-relaxed break-keep mb-3">
                          {item.memo}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                        <span className="text-[11px] text-outline">
                          상태 뱃지를 눌러 진행 상태 전환
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            aria-label="일정 수정"
                            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary-container transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(item.id)}
                            aria-label="일정 삭제"
                            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-on-surface/50 backdrop-blur-xs p-0 sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[460px] bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-on-surface">
                {editingItem ? '일정 수정' : '새 일정 추가'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  일차
                </label>
                <select
                  value={formDay}
                  onChange={(e) => setFormDay(Number(e.target.value) as DayNumber)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-container"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      Day {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  시간
                </label>
                <input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-container"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                장소명 / 일정 제목
              </label>
              <input
                type="text"
                value={formPlace}
                onChange={(e) => {
                  setFormPlace(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder="예: 공항 미팅, 호텔 체크인, 시내 관광"
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>

            {formError && (
              <p className="text-[12px] font-medium text-error">{formError}</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  카테고리
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormCategory(cat)}
                      className={`py-2 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer ${
                        formCategory === cat
                          ? 'bg-primary-container text-on-primary border-primary-container'
                          : 'bg-surface-container-low text-on-surface-variant border-outline-variant/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  진행 상태
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as ItineraryStatus)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-container"
                >
                  {STATUS_ORDER.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                간단 메모
              </label>
              <textarea
                rows={2}
                value={formMemo}
                onChange={(e) => setFormMemo(e.target.value)}
                placeholder="집합 장소, 준비물, 유의사항 등을 입력하세요"
                className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant text-[13px] font-semibold cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                {editingItem ? '수정 완료' : '추가하기'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
