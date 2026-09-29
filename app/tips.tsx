import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../src/constants/theme';
import { useIncubation, SPECIES_CONFIG, SpeciesType } from '../src/context/IncubationContext';

interface TipItem {
  startDay: number;
  endDay: number;
  daysLabel: string;
  title: string;
  tip: string;
  icon: string;
}

const SPECIES_TIPS: Record<SpeciesType, TipItem[]> = {
  tavuk: [
    {
      startDay: 1,
      endDay: 3,
      daysLabel: '1. - 3. Gün',
      title: 'İlk Kurulum & Isı Sabitleme',
      tip: 'Makineyi yumurtaları koymadan en az 24 saat önce çalıştırarak sıcaklık ve nemin sabitlendiğinden (37.8°C) emin olun.',
      icon: 'thermometer',
    },
    {
      startDay: 7,
      endDay: 7,
      daysLabel: '7. Gün',
      title: '1. Döl Kontrolü (Damarlanma)',
      tip: '7. günde damarlanma karanlık bir ortamda fener ışığıyla kontrol edilmeli. Boş yumurtalar ayrılmalıdır.',
      icon: 'flashlight',
    },
    {
      startDay: 8,
      endDay: 14,
      daysLabel: '8. - 14. Gün',
      title: 'Gelişim & Nem Kontrolü',
      tip: 'Embriyo gelişimi büyümüştür. Nem oranını %60-%65 arasında sabit tutmaya özen gösterin.',
      icon: 'water',
    },
    {
      startDay: 18,
      endDay: 21,
      daysLabel: '18. - 21. Gün',
      title: 'Çıkım Dönemi (Kilitlenme)',
      tip: 'Yumurta çevirme durdurulur ve nem %75\'e çıkarılır. Çıkım süresince kapak kesinlikle açılmamalıdır.',
      icon: 'alert-circle',
    },
  ],
  bildircin: [
    {
      startDay: 1,
      endDay: 3,
      daysLabel: '1. - 3. Gün',
      title: 'Bıldırcın Kurulumu',
      tip: 'Bıldırcın yumurtaları için sıcaklık 37.7°C ve nem %60 olarak ayarlanmalıdır. Kabuklar ince olduğu için neme dikkat edilmelidir.',
      icon: 'thermometer',
    },
    {
      startDay: 6,
      endDay: 6,
      daysLabel: '6. Gün',
      title: '1. Döl Kontrolü',
      tip: 'Bıldırcınlarda gelişim hızlıdır. 6. günde döl kontrolü yapılarak boşlar ayıklanır.',
      icon: 'flashlight',
    },
    {
      startDay: 12,
      endDay: 14,
      daysLabel: '12. - 14. Gün',
      title: 'Gelişim Aşaması',
      tip: 'Çevirme işlemi düzenli devam etmelidir. Su hazneleri tam dolu tutulmalıdır.',
      icon: 'water',
    },
    {
      startDay: 15,
      endDay: 17,
      daysLabel: '15. - 17. Gün',
      title: 'Bıldırcın Çıkım Dönemi',
      tip: 'Çevirme durdurulur, nem %75-80 oranına yükseltilir ve çıkım beklenir.',
      icon: 'alert-circle',
    },
  ],
  kaz: [
    {
      startDay: 1,
      endDay: 5,
      daysLabel: '1. - 5. Gün',
      title: 'Kaz Kuluçkası Başlangıcı',
      tip: 'Kaz yumurtaları büyüktür. Sıcaklık 37.5°C olmalıdır. 4. günden itibaren günlük soğutma ve nemlendirme yapılabilir.',
      icon: 'thermometer',
    },
    {
      startDay: 10,
      endDay: 10,
      daysLabel: '10. Gün',
      title: '1. Döl Kontrolü',
      tip: 'Kaz yumurtalarında koyu kabuk nedeniyle ışıkla kontrol dikkatli yapılmalıdır.',
      icon: 'flashlight',
    },
    {
      startDay: 20,
      endDay: 24,
      daysLabel: '20. - 24. Gün',
      title: 'Soğutma ve Havalandırma',
      tip: 'Günde 1-2 kez kabin kapağı 10-15 dakika açılarak havalandırma ve soğutma simülasyonu uygulanır.',
      icon: 'sync',
    },
    {
      startDay: 26,
      endDay: 30,
      daysLabel: '26. - 30. Gün',
      title: 'Kaz Çıkım Kilitlenmesi',
      tip: 'Çevirme kapatılır, nem oranı %80\'e çıkarılır ve kaz yavrularının çıkışı beklenir.',
      icon: 'alert-circle',
    },
  ],
};

export default function TipsScreen() {
  const { species, currentDay } = useIncubation();
  const tips = SPECIES_TIPS[species];

  const isCurrentTip = (start: number, end: number) => currentDay >= start && currentDay <= end;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{SPECIES_CONFIG[species].name} Kuluçka Tavsiyeleri</Text>
        <View style={styles.dayBadge}>
          <Text style={styles.dayBadgeText}>{currentDay}. Gün</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.introText}>
          {SPECIES_CONFIG[species].name} kuluçka sürecine ({currentDay}. Gün) özel uzman önerileri:
        </Text>

        {tips.map((item, index) => {
          const active = isCurrentTip(item.startDay, item.endDay);
          return (
            <View key={index} style={[styles.tipCard, active && styles.activeCard]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, active && styles.activeIconBox]}>
                  <Ionicons name={item.icon as any} size={20} color={active ? COLORS.primary : COLORS.text} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.daysText}>{item.daysLabel}</Text>
                  <Text style={styles.titleText}>{item.title}</Text>
                </View>
                {active && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Aktif Aşama</Text>
                  </View>
                )}
              </View>
              <Text style={styles.tipText}>{item.tip}</Text>
            </View>
          );
        })}
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
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dayBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  tipCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  activeCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFDF5',
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconBox: {
    backgroundColor: '#FEF3C7',
  },
  daysText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tipText: {
    fontSize: 13.5,
    color: COLORS.subtext,
    lineHeight: 20,
  },
});
