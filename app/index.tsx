import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../src/constants/theme';
import { useIncubation, SPECIES_CONFIG, SpeciesType } from '../src/context/IncubationContext';

export default function DashboardScreen() {
  const {
    species,
    setSpecies,
    currentDay,
    totalDays,
    isDemoMode,
    temperature,
    humidity,
    incrementDay,
    decrementDay,
    toggleDemoMode,
    resetProcess,
    updateStats,
  } = useIncubation();

  const [isEditingStats, setIsEditingStats] = useState(false);
  const [tempInput, setTempInput] = useState(temperature);
  const [humInput, setHumInput] = useState(humidity);

  const handleSaveStats = () => {
    updateStats(tempInput, humInput);
    setIsEditingStats(false);
  };

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Kuluçka sürecini 1. güne sıfırlamak istediğinize emin misiniz?')) {
        resetProcess();
        window.alert('Kuluçka süreci 1. günden yeniden başlatıldı.');
      }
    } else {
      Alert.alert(
        'Süreci Sıfırla',
        'Kuluçka sürecini 1. güne sıfırlamak istediğinize emin misiniz?',
        [
          { text: 'Vazgeç', style: 'cancel' },
          {
            text: 'Sıfırla',
            style: 'destructive',
            onPress: () => {
              resetProcess();
              Alert.alert('Başarılı', 'Kuluçka süreci 1. günden yeniden başlatıldı.');
            },
          },
        ]
      );
    }
  };

  const getStatusMessage = () => {
    if (species === 'tavuk') {
      if (currentDay <= 3) return { title: 'İlk Kurulum & Isı Sabitleme', desc: 'Sıcaklık 37.8°C ve nem %55 civarında tutuluyor.' };
      if (currentDay === 7) return { title: '1. Döl Kontrolü (Ooskopi)', desc: 'Damarlanma kontrolü yapılması önerilir.' };
      if (currentDay === 14) return { title: '2. Döl Kontrolü & Gelişim', desc: 'Embriyo büyümesi incelenmeli, hazneye su eklenmeli.' };
      if (currentDay >= 18) return { title: 'Çıkım Dönemi (Kilitlenme)', desc: 'Çevirme durduruldu, nem %75\'e çıkarıldı.' };
    } else if (species === 'bildircin') {
      if (currentDay <= 3) return { title: 'Bıldırcın Kurulumu', desc: 'Sıcaklık 37.7°C, nem %60 olarak ayarlandı.' };
      if (currentDay === 6) return { title: '1. Döl Kontrolü', desc: 'Boş yumurtalar fenerle kontrol edilip ayrılmalı.' };
      if (currentDay >= 15) return { title: 'Çıkım Dönemi', desc: 'Bıldırcın çıkım kilitlenmesi başladı.' };
    } else if (species === 'kaz') {
      if (currentDay <= 5) return { title: 'Kaz Kuluçkası Başlangıcı', desc: 'Yüksek sıcaklık ve günde 2 kez soğutma/püskürtme hazırlığı.' };
      if (currentDay === 10) return { title: '1. Döl Kontrolü', desc: 'Kaz yumurtalarında damarlanma kontrolü.' };
      if (currentDay === 25) return { title: 'Çıkım Öncesi Nem Artışı', desc: 'Nem oranı kademeli olarak %75-80\'e çıkarılır.' };
    }
    return { title: 'Kuluçka Süreci Devam Ediyor', desc: 'Normal akışında ilerliyor.' };
  };

  const statusInfo = getStatusMessage();
  const progressPercent = Math.min(Math.round((currentDay / totalDays) * 100), 100);
  const remainingDays = Math.max(totalDays - currentDay, 0);

  const speciesList: { key: SpeciesType; label: string }[] = [
    { key: 'tavuk', label: 'Tavuk (21G)' },
    { key: 'bildircin', label: 'Bıldırcın (17G)' },
    { key: 'kaz', label: 'Kaz (30G)' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>KULUÇKA TAKİP</Text>
          <Text style={styles.headerTitle}>{SPECIES_CONFIG[species].name} Kuluçkası</Text>
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Ionicons name="refresh" size={16} color={COLORS.temperature} />
          <Text style={styles.resetBtnText}>Sıfırla</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Hayvan Türü Seçim Paneli */}
        <View style={styles.speciesCard}>
          <Text style={styles.speciesCardTitle}>Kuluçka Türü Seçimi</Text>
          <View style={styles.speciesRow}>
            {speciesList.map((item) => {
              const selected = species === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.speciesBtn, selected && styles.speciesBtnSelected]}
                  onPress={() => setSpecies(item.key)}
                >
                  <Text style={[styles.speciesBtnText, selected && styles.speciesBtnTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Deneme Modu Kontrol Paneli */}
        <View style={styles.demoCard}>
          <View style={styles.demoRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="flask" size={18} color={COLORS.primary} />
              <Text style={styles.demoTitle}>Gün Simülasyonu</Text>
            </View>
            <Switch
              value={isDemoMode}
              onValueChange={toggleDemoMode}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={'#fff'}
            />
          </View>

          {isDemoMode && (
            <View style={styles.demoControls}>
              <Text style={styles.demoLabel}>Gün Ayarla:</Text>
              <View style={styles.stepper}>
                <TouchableOpacity style={styles.stepBtn} onPress={decrementDay}>
                  <Ionicons name="remove" size={18} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.stepValue}>{currentDay}. Gün</Text>
                <TouchableOpacity style={styles.stepBtn} onPress={incrementDay}>
                  <Ionicons name="add" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Canlı Süreç Sayacı & Geri Sayım */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressLabel}>Süreç İlerlemesi</Text>
              <Text style={styles.progressValue}>{currentDay}. Gün <Text style={styles.progressTotal}>/ {totalDays} Gün</Text></Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{progressPercent}% Tamamlandı</Text>
            </View>
          </View>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusTitle}>{statusInfo.title}</Text>
            <Text style={styles.statusDesc}>{statusInfo.desc}</Text>
          </View>

          <View style={styles.countdownRow}>
            <Ionicons name="time-outline" size={16} color={COLORS.primary} />
            <Text style={styles.countdownText}>Çıkıma Kalan: <Text style={styles.countdownBold}>{remainingDays} Gün</Text></Text>
          </View>
        </View>

        {/* Anlık Makine Durumu */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Anlık Makine Durumu (Manuel)</Text>
          <TouchableOpacity onPress={() => (isEditingStats ? handleSaveStats() : setIsEditingStats(true))}>
            <Text style={styles.editToggleText}>{isEditingStats ? 'Kaydet' : 'Düzenle'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {/* Sıcaklık */}
          <View style={[styles.statCard, { borderLeftColor: COLORS.temperature }]}>
            <View style={styles.statHeader}>
              <Ionicons name="thermometer" size={22} color={COLORS.temperature} />
              <Text style={styles.statLabel}>Sıcaklık</Text>
            </View>
            {isEditingStats ? (
              <TextInput
                style={styles.statInput}
                value={tempInput}
                onChangeText={setTempInput}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.statValue}>{temperature}°C</Text>
            )}
            <Text style={styles.statSub}>İdeal: 37.5° - 38.0°</Text>
          </View>

          {/* Nem */}
          <View style={[styles.statCard, { borderLeftColor: COLORS.humidity }]}>
            <View style={styles.statHeader}>
              <Ionicons name="water" size={22} color={COLORS.humidity} />
              <Text style={styles.statLabel}>Nem</Text>
            </View>
            {isEditingStats ? (
              <TextInput
                style={styles.statInput}
                value={humInput}
                onChangeText={setHumInput}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.statValue}>%{humidity}</Text>
            )}
            <Text style={styles.statSub}>İdeal: %60 - %70</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 14,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerSubtitle: {
    fontSize: 10,
    color: COLORS.subtext,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  resetBtnText: {
    fontSize: 12,
    color: COLORS.temperature,
    fontWeight: '600',
    marginLeft: 4,
  },
  scroll: {
    padding: SIZES.padding,
    paddingBottom: 32,
  },
  speciesCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  speciesCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  speciesBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  speciesBtnSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  speciesBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  speciesBtnTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  demoCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  demoControls: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demoLabel: {
    fontSize: 13,
    color: COLORS.subtext,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    width: 60,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 2,
  },
  progressTotal: {
    fontSize: 16,
    color: COLORS.subtext,
    fontWeight: 'normal',
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  statusBox: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  statusDesc: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 16,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 13,
    color: COLORS.subtext,
    marginLeft: 6,
  },
  countdownBold: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  editToggleText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.subtext,
    marginLeft: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  statSub: {
    fontSize: 11,
    color: COLORS.subtext,
  },
});
