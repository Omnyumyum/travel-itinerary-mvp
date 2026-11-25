import { useState } from 'react';
import {
  QrCode,
  Plane,
  Building2,
  Ticket,
  Copy,
  Check,
  Maximize2,
  Phone,
  ShieldAlert,
  Pencil,
  X,
} from 'lucide-react';
import type { EmergencyContact, TaxiCardData, VoucherItem, VoucherType } from '../types';

interface VoucherSosModuleProps {
  vouchers: VoucherItem[];
  taxiCard: TaxiCardData;
  contacts: EmergencyContact[];
  onUpdateTaxiCard: (next: TaxiCardData) => void;
}

const VOUCHER_ICON: Record<VoucherType, typeof Plane> = {
  항공권: Plane,
  호텔: Building2,
  입장권: Ticket,
};

function MockQrSvg({ seed }: { seed: string }) {
  // Deterministic 11x11 pattern based on seed string for clean mock QR rendering
  const size = 11;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const cells: boolean[] = [];
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const inTopLeft = r < 3 && c < 3;
      const inTopRight = r < 3 && c >= size - 3;
      const inBottomLeft = r >= size - 3 && c < 3;
      if (inTopLeft || inTopRight || inBottomLeft) {
        cells.push(true);
      } else {
        const bit = ((hash >> ((r * size + c) % 24)) ^ (r + c)) & 1;
        cells.push(bit === 1);
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border border-outline-variant shadow-xs"
      shapeRendering="crispEdges"
      aria-label="모바일 바우처 QR 코드"
    >
      {cells.map((filled, idx) => {
        if (!filled) return null;
        const x = idx % size;
        const y = Math.floor(idx / size);
        return <rect key={idx} x={x} y={y} width={1} height={1} fill="#0b1c30" />;
      })}
    </svg>
  );
}

export function VoucherSosModule({
  vouchers,
  taxiCard,
  contacts,
  onUpdateTaxiCard,
}: VoucherSosModuleProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(null);
  const [selectedSos, setSelectedSos] = useState<EmergencyContact | null>(null);
  const [taxiFullscreen, setTaxiFullscreen] = useState(false);
  const [editingTaxi, setEditingTaxi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [taxiError, setTaxiError] = useState('');

  const [taxiForm, setTaxiForm] = useState<TaxiCardData>(taxiCard);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${taxiCard.hotelNameLocal} ${taxiCard.addressLocal}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handleCopyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 1800);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const openTaxiEdit = () => {
    setTaxiForm(taxiCard);
    setTaxiError('');
    setEditingTaxi(true);
  };

  const saveTaxiEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxiForm.hotelNameLocal.trim() || !taxiForm.addressLocal.trim()) {
      setTaxiError('현지어 숙소명과 현지어 주소는 필수 입력 항목입니다.');
      return;
    }
    setTaxiError('');
    onUpdateTaxiCard({
      hotelNameLocal: taxiForm.hotelNameLocal.trim(),
      addressLocal: taxiForm.addressLocal.trim(),
      hotelNameKo: taxiForm.hotelNameKo.trim(),
      addressKo: taxiForm.addressKo.trim(),
      languageLabel: taxiForm.languageLabel.trim() || '현지어 택시 안내 카드',
    });
    setEditingTaxi(false);
  };

  return (
    <div className="space-y-5">
      {/* 1. Digital Vouchers */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-on-surface">디지털 바우처 월렛</h2>
          <span className="text-[11px] font-semibold text-primary-container">
            {vouchers.length}건 보관 중
          </span>
        </div>

        <div className="space-y-2.5">
          {vouchers.map((voucher) => {
            const Icon = VOUCHER_ICON[voucher.type];
            return (
              <div
                key={voucher.id}
                onClick={() => setSelectedVoucher(voucher)}
                className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/40 flex items-center justify-between gap-3 hover:border-primary-container/60 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-secondary-fixed text-[10px] font-semibold">
                        {voucher.type}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-primary-container">
                        {voucher.reservationCode}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-bold text-on-surface truncate">
                      {voucher.title}
                    </h3>
                    <p className="text-[12px] text-on-surface-variant truncate">
                      {voucher.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVoucher(voucher);
                  }}
                  className="px-3 py-2 rounded-xl bg-primary-container text-on-primary text-[12px] font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-transform cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  QR
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Local Language Taxi Card */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-on-surface">현지어 택시 카드 (숙소)</h2>
          <button
            type="button"
            onClick={openTaxiEdit}
            className="text-[12px] font-semibold text-primary-container flex items-center gap-1 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            숙소 변경
          </button>
        </div>

        <div className="rounded-2xl bg-tertiary-fixed/75 p-4 border border-tertiary-container/25 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[11px] font-bold">
              {taxiCard.languageLabel}
            </span>
            <span className="text-[11px] text-on-tertiary-fixed-variant font-medium">
              기사님께 화면을 보여주세요
            </span>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-4 space-y-1.5 border border-tertiary-container/15">
            <p className="text-[20px] font-bold text-on-surface leading-snug break-keep">
              {taxiCard.hotelNameLocal}
            </p>
            <p className="text-[14px] font-semibold text-on-surface-variant break-keep">
              {taxiCard.addressLocal}
            </p>
            <div className="pt-2 mt-2 border-t border-surface-container text-[12px] text-outline">
              {taxiCard.hotelNameKo} · {taxiCard.addressKo}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTaxiFullscreen(true)}
              className="py-2.5 px-3 rounded-xl bg-on-surface text-surface-container-lowest text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              화면 크게 보기
            </button>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="py-2.5 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-[12px] font-semibold border border-outline-variant/50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? '복사됨' : '주소 복사'}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Local Emergency Contacts */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-error" />
            <h2 className="text-[15px] font-bold text-on-surface">현지 비상연락처 (SOS)</h2>
          </div>
          {contacts[0] && (
            <button
              type="button"
              onClick={() => setSelectedSos(contacts[0])}
              className="text-[12px] font-semibold text-error flex items-center gap-1 cursor-pointer"
            >
              긴급 안내 모달
            </button>
          )}
        </div>

        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedSos(contact)}
              className={`rounded-2xl p-3.5 border shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all hover:border-error/40 ${
                contact.isUrgent
                  ? 'bg-error-container/35 border-error/25'
                  : 'bg-surface-container-lowest border-outline-variant/40'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      contact.isUrgent
                        ? 'bg-error text-white'
                        : 'bg-secondary-container text-on-secondary-fixed'
                    }`}
                  >
                    {contact.badge}
                  </span>
                  <span className="text-[12px] font-bold text-on-surface truncate">
                    {contact.role}
                  </span>
                </div>
                <p className="text-[12px] text-on-surface-variant">
                  {contact.name} · <span className="font-mono font-semibold">{contact.phone}</span>
                </p>
              </div>

              <a
                href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                onClick={(e) => e.stopPropagation()}
                className={`px-3 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1 shrink-0 ${
                  contact.isUrgent
                    ? 'bg-error text-white'
                    : 'bg-primary-fixed text-primary hover:bg-primary-container hover:text-on-primary transition-colors'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                전화
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Voucher QR Modal */}
      {selectedVoucher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedVoucher(null)}
        >
          <div
            className="w-full max-w-[380px] bg-surface-container-lowest rounded-3xl p-6 shadow-2xl space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-bold">
                {selectedVoucher.type} 바우처
              </span>
              <button
                type="button"
                onClick={() => setSelectedVoucher(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-[17px] font-bold text-on-surface">{selectedVoucher.title}</h3>
              <p className="text-[12.5px] text-on-surface-variant mt-0.5">
                {selectedVoucher.subtitle}
              </p>
            </div>

            <MockQrSvg seed={selectedVoucher.qrSeed} />

            <div className="rounded-xl bg-surface-container-low p-3 space-y-1">
              <p className="text-[11px] text-on-surface-variant">예약 번호</p>
              <p className="text-[18px] font-mono font-bold text-primary tracking-wider">
                {selectedVoucher.reservationCode}
              </p>
              <p className="text-[11.5px] text-on-surface-variant pt-1">
                {selectedVoucher.detailLabel}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Taxi Card Fullscreen Modal */}
      {taxiFullscreen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-on-surface p-6 text-center"
          onClick={() => setTaxiFullscreen(false)}
        >
          <div className="w-full max-w-[420px] rounded-3xl bg-white p-7 space-y-5 shadow-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[12px] font-bold">
              택시 기사님 안내용
            </span>
            <h3 className="text-[28px] font-bold text-on-surface leading-tight break-keep">
              {taxiCard.hotelNameLocal}
            </h3>
            <p className="text-[18px] font-semibold text-on-surface-variant leading-relaxed break-keep">
              {taxiCard.addressLocal}
            </p>
            <div className="pt-4 border-t border-outline-variant/40 text-[13px] text-outline">
              {taxiCard.hotelNameKo} ({taxiCard.addressKo})
            </div>
            <button
              type="button"
              onClick={() => setTaxiFullscreen(false)}
              className="w-full py-3 rounded-xl bg-primary-container text-on-primary text-[14px] font-bold cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* SOS Emergency Modal */}
      {selectedSos && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedSos(null)}
        >
          <div
            className="w-full max-w-[390px] bg-surface-container-lowest rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-error-container text-error text-[11px] font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {selectedSos.badge}
              </span>
              <button
                type="button"
                onClick={() => setSelectedSos(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-center">
              <p className="text-[12px] font-semibold text-on-surface-variant">
                {selectedSos.role}
              </p>
              <h3 className="text-[19px] font-bold text-on-surface">
                {selectedSos.name}
              </h3>
              <p className="text-[24px] font-mono font-bold text-error tracking-wide pt-1">
                {selectedSos.phone}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${selectedSos.phone.replace(/[^+\d]/g, '')}`}
                className="py-3 px-3 rounded-xl bg-error text-white text-[13px] font-bold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                바로 전화걸기
              </a>
              <button
                type="button"
                onClick={() => handleCopyPhone(selectedSos.phone)}
                className="py-3 px-3 rounded-xl bg-surface-container text-on-surface text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copiedPhone ? '번호 복사됨' : '번호 복사'}
              </button>
            </div>

            <div className="rounded-xl bg-tertiary-fixed/60 p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-on-tertiary-fixed">현재 숙소</p>
                <p className="text-[12px] text-on-tertiary-fixed-variant truncate">
                  {taxiCard.hotelNameLocal}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSos(null);
                  setTaxiFullscreen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface text-[11px] font-semibold shrink-0 cursor-pointer"
              >
                택시 카드 보기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Taxi Card Edit Modal */}
      {editingTaxi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-xs p-4">
          <form
            onSubmit={saveTaxiEdit}
            className="w-full max-w-[420px] bg-surface-container-lowest rounded-2xl p-5 shadow-xl space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-on-surface">숙소 택시 카드 수정</h3>
              <button
                type="button"
                onClick={() => setEditingTaxi(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  카드 라벨
                </label>
                <input
                  type="text"
                  value={taxiForm.languageLabel}
                  onChange={(e) => setTaxiForm({ ...taxiForm, languageLabel: e.target.value })}
                  placeholder="예: 일본어 택시 안내 카드"
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  현지어 숙소명
                </label>
                <input
                  type="text"
                  value={taxiForm.hotelNameLocal}
                  onChange={(e) => {
                    setTaxiForm({ ...taxiForm, hotelNameLocal: e.target.value });
                    if (taxiError) setTaxiError('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  현지어 주소
                </label>
                <input
                  type="text"
                  value={taxiForm.addressLocal}
                  onChange={(e) => {
                    setTaxiForm({ ...taxiForm, addressLocal: e.target.value });
                    if (taxiError) setTaxiError('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-[13px]"
                />
              </div>
              {taxiError && (
                <p className="text-[12px] font-medium text-error">{taxiError}</p>
              )}
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  한국어 숙소명
                </label>
                <input
                  type="text"
                  value={taxiForm.hotelNameKo}
                  onChange={(e) => setTaxiForm({ ...taxiForm, hotelNameKo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  한국어 주소
                </label>
                <input
                  type="text"
                  value={taxiForm.addressKo}
                  onChange={(e) => setTaxiForm({ ...taxiForm, addressKo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-[13px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditingTaxi(false)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface-variant text-[13px] font-semibold cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary-container text-on-primary text-[13px] font-semibold cursor-pointer"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
