import { useState } from 'react';
import {
  DEFAULT_CHECKLIST,
  DEFAULT_EMERGENCY_CONTACTS,
  DEFAULT_ITINERARY,
  DEFAULT_NOTICE,
  DEFAULT_TAXI_CARD,
  DEFAULT_TRIP_META,
  DEFAULT_VOUCHERS,
  STORAGE_KEYS,
} from './data/mockData';
import { clearAllTravelStorage, useLocalStorage } from './hooks/useLocalStorage';
import type {
  ChecklistCategory,
  ChecklistItem,
  EmergencyContact,
  ItineraryItem,
  NoticeData,
  TabKey,
  TaxiCardData,
  TripMeta,
  VoucherItem,
} from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NoticeBanner } from './components/NoticeBanner';
import { ItineraryModule } from './components/ItineraryModule';
import { ChecklistModule } from './components/ChecklistModule';
import { VoucherSosModule } from './components/VoucherSosModule';

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('itinerary');

  const [tripMeta, setTripMeta] = useLocalStorage<TripMeta>(
    STORAGE_KEYS.TRIP_META,
    DEFAULT_TRIP_META
  );
  const [itinerary, setItinerary] = useLocalStorage<ItineraryItem[]>(
    STORAGE_KEYS.ITINERARY,
    DEFAULT_ITINERARY
  );
  const [notice, setNotice] = useLocalStorage<NoticeData>(
    STORAGE_KEYS.NOTICE,
    DEFAULT_NOTICE
  );
  const [checklist, setChecklist] = useLocalStorage<ChecklistItem[]>(
    STORAGE_KEYS.CHECKLIST,
    DEFAULT_CHECKLIST
  );
  const [vouchers, setVouchers] = useLocalStorage<VoucherItem[]>(
    STORAGE_KEYS.VOUCHERS,
    DEFAULT_VOUCHERS
  );
  const [taxiCard, setTaxiCard] = useLocalStorage<TaxiCardData>(
    STORAGE_KEYS.TAXI_CARD,
    DEFAULT_TAXI_CARD
  );
  const [contacts, setContacts] = useLocalStorage<EmergencyContact[]>(
    STORAGE_KEYS.EMERGENCY_CONTACTS,
    DEFAULT_EMERGENCY_CONTACTS
  );

  const handleResetAll = () => {
    if (!window.confirm('모든 일정, 공지, 체크리스트 데이터를 초기 샘플 상태로 되돌릴까요?')) {
      return;
    }
    clearAllTravelStorage();
    setTripMeta(DEFAULT_TRIP_META);
    setItinerary(DEFAULT_ITINERARY);
    setNotice(DEFAULT_NOTICE);
    setChecklist(DEFAULT_CHECKLIST);
    setVouchers(DEFAULT_VOUCHERS);
    setTaxiCard(DEFAULT_TAXI_CARD);
    setContacts(DEFAULT_EMERGENCY_CONTACTS);
  };

  // Module 1: Itinerary CRUD
  const handleAddItinerary = (item: Omit<ItineraryItem, 'id'>) => {
    const newItem: ItineraryItem = {
      ...item,
      id: `it-${Date.now()}`,
    };
    setItinerary((prev) => [...prev, newItem]);
  };

  const handleUpdateItinerary = (updated: ItineraryItem) => {
    setItinerary((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
  };

  const handleDeleteItinerary = (id: string) => {
    setItinerary((prev) => prev.filter((it) => it.id !== id));
  };

  // Module 2: Checklist CRUD
  const handleAddChecklist = (text: string, category: ChecklistCategory) => {
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      text,
      category,
      completed: false,
    };
    setChecklist((prev) => [...prev, newItem]);
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteChecklist = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const pendingChecklistCount = checklist.filter((c) => !c.completed).length;

  return (
    <div className="min-h-screen w-full bg-slate-100 flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen bg-surface flex flex-col relative shadow-lg">
        <Header
          tripMeta={tripMeta}
          onUpdateTripMeta={setTripMeta}
          onResetAll={handleResetAll}
        />

        <main className="flex-1 px-4 pt-20 pb-24 space-y-4">
          {activeTab !== 'voucher' && (
            <NoticeBanner notice={notice} onUpdateNotice={setNotice} />
          )}

          {activeTab === 'itinerary' && (
            <ItineraryModule
              items={itinerary}
              tripMeta={tripMeta}
              onAdd={handleAddItinerary}
              onUpdate={handleUpdateItinerary}
              onDelete={handleDeleteItinerary}
            />
          )}

          {activeTab === 'checklist' && (
            <ChecklistModule
              items={checklist}
              onAdd={handleAddChecklist}
              onToggle={handleToggleChecklist}
              onDelete={handleDeleteChecklist}
            />
          )}

          {activeTab === 'voucher' && (
            <VoucherSosModule
              vouchers={vouchers}
              taxiCard={taxiCard}
              contacts={contacts}
              onUpdateTaxiCard={setTaxiCard}
            />
          )}
        </main>

        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          checklistBadge={pendingChecklistCount > 0 ? String(pendingChecklistCount) : undefined}
        />
      </div>
    </div>
  );
}

export default App;
