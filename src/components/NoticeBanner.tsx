import { useState } from 'react';
import { Megaphone, PencilLine, Check, X } from 'lucide-react';
import type { NoticeData } from '../types';
import { hasUnsafeHtml, sanitizePlainText } from '../utils/sanitize';

interface NoticeBannerProps {
  notice: NoticeData;
  onUpdateNotice: (next: NoticeData) => void;
}

export function NoticeBanner({ notice, onUpdateNotice }: NoticeBannerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(notice.content);
  const [error, setError] = useState('');

  const startEdit = () => {
    setDraft(notice.content);
    setError('');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) {
      setError('공지 내용을 입력해 주세요.');
      return;
    }
    if (hasUnsafeHtml(trimmed)) {
      setError('HTML 태그나 script 코드는 입력할 수 없습니다.');
      return;
    }
    setError('');
    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    onUpdateNotice({
      content: sanitizePlainText(trimmed),
      updatedAt: `방금 ${timeLabel}`,
    });
    setIsEditing(false);
  };

  return (
    <section className="w-full">
      <div className="relative overflow-hidden rounded-2xl bg-tertiary-fixed p-3.5 shadow-xs border border-tertiary-container/15">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Megaphone className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[12px] font-bold text-on-tertiary-fixed">
                  인솔자 긴급 공지
                </span>
                <span className="text-[10px] text-on-tertiary-fixed-variant/80 font-medium">
                  · {notice.updatedAt}
                </span>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="mt-1 space-y-2">
                  <textarea
                    value={draft}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      if (error) setError('');
                    }}
                    rows={2}
                    className="w-full rounded-xl border border-tertiary-container/30 bg-surface-container-lowest px-2.5 py-2 text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-container"
                    placeholder="공지 내용을 입력하세요"
                    autoFocus
                  />
                  {error && (
                    <p className="text-[11.5px] font-medium text-error">{error}</p>
                  )}
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-lowest/80 text-on-surface-variant text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded-lg bg-tertiary-container text-on-tertiary-container text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      저장
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-[13px] text-on-tertiary-fixed-variant font-medium leading-snug break-keep">
                  {notice.content}
                </p>
              )}
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={startEdit}
              aria-label="공지사항 수정"
              className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container-lowest/85 text-on-surface-variant text-[11px] font-semibold flex items-center gap-1 hover:bg-surface-container-lowest active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <PencilLine className="w-3.5 h-3.5" />
              <span>수정</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
