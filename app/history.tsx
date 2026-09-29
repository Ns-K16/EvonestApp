import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../src/constants/theme';
import { IncubationProvider, useIncubation } from '../src/context/IncubationContext';

function HistoryContent() {
  const { dayHistory, currentDay } = useIncubation();

  const recordedDays = Object.keys(dayHistory)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Geçmiş Ölçüm Kayıtları</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.introText}>
          Kuluçka süresince gün bazında kaydettiğiniz sıcaklık ve nem değerleri:
        </Text>

        {recordedDays.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={48} color={COLORS.subtext} />
            <Text style={styles.emptyText}>Henüz kaydedilmiş bir ölçüm bulunmuyor.</Text>
            <Text style={styles.emptySubText}>Ana ekrandan değerleri düzenleyip kaydettikçe burada listelenecektir.</Text>
          </View>
        ) : (
          recordedDays.map((day) => {
            const record = dayHistory[day];
            const isToday = day === currentDay;
            return (
              <View key={day} style={[styles.historyCard, isToday && styles.activeHistoryCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>{day}. Gün</Text>
                  </View>
                  {isToday && <Text style={styles.todayLabel}>Aktif Gün</Text>}
                </View>

                <View style={styles.recordRow}>
                  <View style={styles.recordItem}>
                    <Ionicons name="thermometer" size={18} color={COLORS.temperature} />
                    <Text style={styles.recordLabel}>Sıcaklık:</Text>
                    <Text style={styles.recordValue}>{record.temperature}°C</Text>
                  </View>
                  <View style={styles.recordItem}>
                    <Ionicons name="water" size={18} color={COLORS.humidity} />
                    <Text style={styles.recordLabel}>Nem:</Text>
                    <Text style={styles.recordValue}>%{record.humidity}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function HistoryScreen() {
  return (
    <IncubationProvider>
      <HistoryContent />
    </IncubationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 14,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scroll: {
    padding: SIZES.padding,
    paddingBottom: 32,
  },
  introText: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 16,
    lineHeight: 20,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 32,
    marginTop: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 13,
    color: COLORS.subtext,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  historyCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeHistoryCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFDF5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  todayLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordLabel: {
    fontSize: 13,
    color: COLORS.subtext,
  },
  recordValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
