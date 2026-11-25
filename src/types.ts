export type TabKey = 'itinerary' | 'checklist' | 'voucher';

export type DayNumber = 1 | 2 | 3;

export type ItineraryCategory = '이동' | '관광' | '식사' | '숙소';

export type ItineraryStatus = '예정' | '진행 중' | '완료';

export interface TripMeta {
  title: string;
  durationBadge: string;
  subtitle: string;
  dayLabels: Record<DayNumber, { title: string; dateLabel: string; summary: string }>;
}

export interface ItineraryItem {
  id: string;
  day: DayNumber;
  time: string;
  place: string;
  category: ItineraryCategory;
  memo: string;
  status: ItineraryStatus;
}

export interface NoticeData {
  content: string;
  updatedAt: string;
}

export type ChecklistCategory = '준비물' | '출석';

export interface ChecklistItem {
  id: string;
  text: string;
  category: ChecklistCategory;
  completed: boolean;
  memo?: string;
}

export type VoucherType = '항공권' | '호텔' | '입장권';

export interface VoucherItem {
  id: string;
  type: VoucherType;
  title: string;
  subtitle: string;
  reservationCode: string;
  detailLabel: string;
  qrSeed: string;
}

export interface TaxiCardData {
  hotelNameLocal: string;
  addressLocal: string;
  hotelNameKo: string;
  addressKo: string;
  languageLabel: string;
}

export interface EmergencyContact {
  id: string;
  role: string;
  name: string;
  phone: string;
  badge: string;
  isUrgent?: boolean;
}
