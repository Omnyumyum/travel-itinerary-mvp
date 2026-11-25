import type {
  ChecklistItem,
  EmergencyContact,
  ItineraryItem,
  NoticeData,
  TaxiCardData,
  TripMeta,
  VoucherItem,
} from '../types';

export const STORAGE_KEYS = {
  TRIP_META: 'travel_mvp_trip_meta',
  ITINERARY: 'travel_mvp_itinerary',
  NOTICE: 'travel_mvp_notice',
  CHECKLIST: 'travel_mvp_checklist',
  VOUCHERS: 'travel_mvp_vouchers',
  TAXI_CARD: 'travel_mvp_taxi_card',
  EMERGENCY_CONTACTS: 'travel_mvp_emergency_contacts',
} as const;

export const DEFAULT_TRIP_META: TripMeta = {
  title: '도쿄 2박 3일 패키지 투어',
  durationBadge: '2박 3일',
  subtitle: '예시 일정 · 가이드 & 여행객 통합 관리',
  dayLabels: {
    1: { title: 'Day 1', dateLabel: '1일차', summary: '공항 도착 및 아사쿠사 중심 투어' },
    2: { title: 'Day 2', dateLabel: '2일차', summary: '시부야 스카이 · 도쿄 도심 명소' },
    3: { title: 'Day 3', dateLabel: '3일차', summary: '기념품 쇼핑 및 귀국 이동' },
  },
};

export const DEFAULT_NOTICE: NoticeData = {
  content: '내일 조식은 07:30 2층 레스토랑, 버스 탑승은 08:30 로비 집합입니다.',
  updatedAt: '오늘 09:00',
};

export const DEFAULT_ITINERARY: ItineraryItem[] = [
  {
    id: 'it-1',
    day: 1,
    time: '09:30',
    place: '인천국제공항 제1터미널 미팅',
    category: '이동',
    memo: '3층 출국장 A카운터 앞 가이드 미팅 및 항공권 수령',
    status: '완료',
  },
  {
    id: 'it-2',
    day: 1,
    time: '13:30',
    place: '나리타 공항 도착 → 전용 버스 이동',
    category: '이동',
    memo: '입국 수속 후 1층 도착 로비 남쪽 출구 집결',
    status: '진행 중',
  },
  {
    id: 'it-3',
    day: 1,
    time: '15:30',
    place: '아사쿠사 센소지 & 나카미세 거리',
    category: '관광',
    memo: '가미나리몬 앞 단체 사진 촬영 후 자유 시간 60분',
    status: '예정',
  },
  {
    id: 'it-4',
    day: 1,
    time: '18:30',
    place: '신주쿠 현지식 샤브샤브 석식',
    category: '식사',
    memo: '음료 1잔 포함, 알레르기 있으신 분은 가이드에게 사전 말씀',
    status: '예정',
  },
  {
    id: 'it-5',
    day: 1,
    time: '20:30',
    place: '신주쿠 워싱턴 호텔 체크인',
    category: '숙소',
    memo: '객실 키 수령 및 내일 조식 쿠폰 확인',
    status: '예정',
  },
  {
    id: 'it-6',
    day: 2,
    time: '08:30',
    place: '호텔 로비 집합 및 출발',
    category: '이동',
    memo: '조식(07:30~08:20) 후 전용 버스 탑승',
    status: '예정',
  },
  {
    id: 'it-7',
    day: 2,
    time: '10:00',
    place: '메이지 신궁 & 하라주쿠 산책',
    category: '관광',
    memo: '도심 속 숲길 산책 및 다케시타 거리 자유 관람',
    status: '예정',
  },
  {
    id: 'it-8',
    day: 2,
    time: '12:30',
    place: '시부야 규카츠 중식',
    category: '식사',
    memo: '단체 예약 좌석으로 바로 입장',
    status: '예정',
  },
  {
    id: 'it-9',
    day: 2,
    time: '17:00',
    place: '시부야 스카이 전망대 (일몰)',
    category: '관광',
    memo: '바우처 탭에서 QR코드 미리 준비해 주세요',
    status: '예정',
  },
  {
    id: 'it-10',
    day: 3,
    time: '09:30',
    place: '체크아웃 및 짐 보관 후 긴자 자유 쇼핑',
    category: '관광',
    memo: '면세 쇼핑 시 여권 필수 지참',
    status: '예정',
  },
  {
    id: 'it-11',
    day: 3,
    time: '14:00',
    place: '나리타 공항 이동 및 출국 수속',
    category: '이동',
    memo: '수하물 무게(23kg) 확인 및 면세품 수령',
    status: '예정',
  },
];

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    text: '여권 (유효기간 6개월 이상) 및 e-티켓 지참',
    category: '준비물',
    completed: true,
    memo: '면세 쇼핑 및 호텔 체크인 시 필수',
  },
  {
    id: 'chk-2',
    text: '해외 eSIM / 데이터 로밍 개통 확인',
    category: '준비물',
    completed: true,
    memo: '현지 도착 즉시 데이터 연결 테스트',
  },
  {
    id: 'chk-3',
    text: '110V 멀티 어댑터 (돼지코) & 보조배터리',
    category: '준비물',
    completed: true,
    memo: '보조배터리는 반드시 기내 수하물로 휴대',
  },
  {
    id: 'chk-4',
    text: '투어 인원 공항 미팅 출석 확인 (총 16명)',
    category: '출석',
    completed: false,
    memo: '출발 2시간 전 카운터 집결 완료 체크',
  },
  {
    id: 'chk-5',
    text: '개인 상비약 및 편한 운동화 준비',
    category: '준비물',
    completed: false,
    memo: '도보 이동 일정 대비',
  },
];

export const DEFAULT_VOUCHERS: VoucherItem[] = [
  {
    id: 'vch-1',
    type: '항공권',
    title: '왕복 항공권 e-티켓',
    subtitle: '인천(ICN) ✈ 나리타(NRT) · KE703',
    reservationCode: 'KE-894210',
    detailLabel: '좌석 28A · 수하물 23kg 포함',
    qrSeed: 'KE-894210-ICN-NRT',
  },
  {
    id: 'vch-2',
    type: '호텔',
    title: '신주쿠 워싱턴 호텔 숙박권',
    subtitle: '2박 조식 포함 · 트윈룸',
    reservationCode: 'WH-2026-10189',
    detailLabel: '체크인 15:00 / 체크아웃 11:00',
    qrSeed: 'WH-2026-10189-HOTEL',
  },
  {
    id: 'vch-3',
    type: '입장권',
    title: '시부야 스카이 전망대 입장권',
    subtitle: 'Day 2 · 17:00 일몰 타임 슬롯',
    reservationCode: 'SBS-77491',
    detailLabel: '14층 엘리베이터 입구 QR 스캔',
    qrSeed: 'SBS-77491-SHIBUYA',
  },
];

export const DEFAULT_TAXI_CARD: TaxiCardData = {
  hotelNameLocal: '新宿ワシントンホテル',
  addressLocal: '東京都新宿区西新宿3-2-9',
  hotelNameKo: '신주쿠 워싱턴 호텔',
  addressKo: '도쿄도 신주쿠구 니시신주쿠 3-2-9',
  languageLabel: '일본어 택시 안내 카드',
};

export const DEFAULT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'sos-1',
    role: '담당 인솔 가이드',
    name: '김민수 가이드',
    phone: '+81-90-1234-5678',
    badge: '24시간 직통',
  },
  {
    id: 'sos-2',
    role: '주일 대한민국 대사관 (영사과)',
    name: '긴급 사건·사고 당직',
    phone: '+81-3-3452-7611',
    badge: '대사관',
  },
  {
    id: 'sos-3',
    role: '현지 경찰 신고',
    name: '분실·도난·치안 긴급',
    phone: '110',
    badge: '경찰 110',
    isUrgent: true,
  },
  {
    id: 'sos-4',
    role: '현지 구급·소방 신고',
    name: '응급환자·화재 긴급',
    phone: '119',
    badge: '구급 119',
    isUrgent: true,
  },
];
