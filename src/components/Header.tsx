import { useState } from 'react';
import { RotateCcw, Pencil, Compass, X, Check } from 'lucide-react';
import type { TripMeta } from '../types';

interface HeaderProps {
  tripMeta: TripMeta;
  onUpdateTripMeta: (next: TripMeta) => void;
  onResetAll: () => void;
}

export function Header({ tripMeta, onUpdateTripMeta, onResetAll }: HeaderProps) {
  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const [title, setTitle] = useState(tripMeta.title);
  const [durationBadge, setDurationBadge] = useState(tripMeta.durationBadge);
  const [subtitle, setSubtitle] = useState(tripMeta.subtitle);
  const [error, setError] = useState('');

  const openEdit = () => {
    setTitle(tripMeta.title);
    setDurationBadge(tripMeta.durationBadge);
    setSubtitle(tripMeta.subtitle);
    setError('');
    setIsEditingTrip(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('여행 제목을 입력해 주세요.');
      return;
    }
    if (trimmedTitle.length > 40) {
      setError('여행 제목은 40자 이내로 입력해 주세요.');
      return;
    }
    setError('');
    onUpdateTripMeta({
      ...tripMeta,
      title: trimmedTitle,
      durationBadge: durationBadge.trim() || '여행',
      subtitle: subtitle.trim() || '가이드 & 여행객 통합 관리',
    });
    setIsEditingTrip(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full max-w-[480px] z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/40 pt-safe">
        <div className="h-16 px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[15px] font-bold text-on-surface truncate">
                  {tripMeta.title}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-semibold whitespace-nowrap shrink-0">
                  {tripMeta.durationBadge}
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant truncate">
                {tripMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={openEdit}
              aria-label="여행 정보 수정"
              title="여행 정보 수정"
              className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onResetAll}
              aria-label="데이터 초기화"
              title="초기 샘플 데이터로 복원"
              className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {isEditingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-[420px] bg-surface-container-lowest rounded-2xl p-5 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-on-surface">여행 기본 정보 수정</h2>
              <button
                type="button"
                onClick={() => setIsEditingTrip(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  여행 제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="예: 오사카 3박 4일 가족 여행"
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
                {error && (
                  <p className="mt-1 text-[12px] font-medium text-error">{error}</p>
                )}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  기간 뱃지
                </label>
                <input
                  type="text"
                  value={durationBadge}
                  onChange={(e) => setDurationBadge(e.target.value)}
                  placeholder="예: 3박 4일"
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  부제목 / 안내 문구
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="예: 11.25 - 11.27 · 가이드 김민수"
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingTrip(false)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface-variant text-[13px] font-semibold cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary-container text-on-primary text-[13px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
