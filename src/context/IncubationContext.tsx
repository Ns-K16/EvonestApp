import React, { createContext, useContext, useState, useEffect } from 'react';

export type SpeciesType = 'tavuk' | 'bildircin' | 'kaz';

interface SpeciesConfig {
  name: string;
  totalDays: number;
}

export const SPECIES_CONFIG: Record<SpeciesType, SpeciesConfig> = {
  tavuk: { name: 'Tavuk', totalDays: 21 },
  bildircin: { name: 'Bıldırcın', totalDays: 17 },
  kaz: { name: 'Kaz', totalDays: 30 },
};

interface DayRecord {
  temperature: string;
  humidity: string;
}

interface IncubationContextType {
  species: SpeciesType;
  setSpecies: (species: SpeciesType) => void;
  currentDay: number;
  totalDays: number;
  isDemoMode: boolean;
  temperature: string;
  humidity: string;
  dayHistory: Record<number, DayRecord>;
  dayNotes: Record<number, string>;
  incrementDay: () => void;
  decrementDay: () => void;
  setDay: (day: number) => void;
  toggleDemoMode: () => void;
  resetProcess: () => void;
  updateStats: (temp: string, hum: string) => void;
  saveDayNote: (day: number, note: string) => void;
  saveCurrentDayStats: (temp: string, hum: string) => void;
}

const IncubationContext = createContext<IncubationContextType | undefined>(undefined);

export const IncubationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [species, setSpeciesState] = useState<SpeciesType>('tavuk');
  const totalDays = SPECIES_CONFIG[species].totalDays;

  const [currentDay, setCurrentDay] = useState<number>(14);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<string>('37.8');
  const [humidity, setHumidity] = useState<string>('65');

  const [dayHistory, setDayHistory] = useState<Record<number, DayRecord>>({
    1: { temperature: '37.8', humidity: '55' },
    7: { temperature: '37.7', humidity: '60' },
    14: { temperature: '37.8', humidity: '65' },
  });

  // Her güne özel kişisel kuluçka notları
  const [dayNotes, setDayNotes] = useState<Record<number, string>>({
    1: '1. Gün: Makine test edildi, sıcaklık ve nem ideal seviyede.',
    7: '7. Gün: Döl kontrolü yapıldı, damarlanmalar net şekilde görülüyor.',
    14: '14. Gün: Çıkım öncesi son hazırlıklar gözden geçirildi.',
  });

  const setSpecies = (newSpecies: SpeciesType) => {
    setSpeciesState(newSpecies);
    const newTotal = SPECIES_CONFIG[newSpecies].totalDays;
    if (currentDay > newTotal) {
      setCurrentDay(newTotal);
    }
  };

  const incrementDay = () => {
    if (currentDay < totalDays) {
      const nextDay = currentDay + 1;
      setCurrentDay(nextDay);
      if (dayHistory[nextDay]) {
        setTemperature(dayHistory[nextDay].temperature);
        setHumidity(dayHistory[nextDay].humidity);
      }
    }
  };

  const decrementDay = () => {
    if (currentDay > 1) {
      const prevDay = currentDay - 1;
      setCurrentDay(prevDay);
      if (dayHistory[prevDay]) {
        setTemperature(dayHistory[prevDay].temperature);
        setHumidity(dayHistory[prevDay].humidity);
      }
    }
  };

  const setDay = (day: number) => {
    if (day >= 1 && day <= totalDays) {
      setCurrentDay(day);
      if (dayHistory[day]) {
        setTemperature(dayHistory[day].temperature);
        setHumidity(dayHistory[day].humidity);
      }
    }
  };

  const toggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };

  const resetProcess = () => {
    setCurrentDay(1);
    setDayHistory({});
    setDayNotes({});
    setTemperature('37.8');
    setHumidity('55');
  };

  const updateStats = (temp: string, hum: string) => {
    setTemperature(temp);
    setHumidity(hum);
    setDayHistory(prev => ({
      ...prev,
      [currentDay]: { temperature: temp, humidity: hum }
    }));
  };

  const saveDayNote = (day: number, note: string) => {
    setDayNotes(prev => ({
      ...prev,
      [day]: note,
    }));
  };

  const saveCurrentDayStats = (temp: string, hum: string) => {
    updateStats(temp, hum);
  };

  return (
    <IncubationContext.Provider
      value={{
        species,
        setSpecies,
        currentDay,
        totalDays,
        isDemoMode,
        temperature,
        humidity,
        dayHistory,
        dayNotes,
        incrementDay,
        decrementDay,
        setDay,
        toggleDemoMode,
        resetProcess,
        updateStats,
        saveDayNote,
        saveCurrentDayStats,
      }}
    >
      {children}
    </IncubationContext.Provider>
  );
};

export const useIncubation = () => {
  const context = useContext(IncubationContext);
  if (!context) {
    throw new Error('useIncubation must be used within an IncubationProvider');
  }
  return context;
};
