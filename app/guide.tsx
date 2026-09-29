import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../src/constants/theme';
import { useIncubation, SPECIES_CONFIG, SpeciesType } from '../src/context/IncubationContext';

interface SpeciesGuideDetail {
  title: string;
  duration: string;
  temp: string;
  humidity: string;
  hatchTemp: string;
  hatchHumidity: string;
  expertTips: string[];
}

const SPECIES_GUIDES: Record<SpeciesType, SpeciesGuideDetail> = {
  tavuk: {
    title: 'Tavuk Kuluçka Rehberi',
    duration: '21 Gün',
    temp: '37.8°C',
    humidity: '%55 - %60',
    hatchTemp: '37.2°C',
    hatchHumidity: '%75',
    expertTips: [
      '1. - 18. günler arasında yumurtalar günde en az 4-6 kez otomatik veya el ile çevrilmelidir.',
      '7. günde karanlık ortamda fener ile 1. döl kontrolü (damarlanma) yapılmalıdır.',
      '18. günden sonra çevirme durdurulur, kabin kilitlenir ve nem %75\'e çıkarılır.',
      'Çıkım esnasında sabırlı olunmalı, kabin kapağı kesinlikle açılmamalıdır.',
    ],
  },
  bildircin: {
    title: 'Bıldırcın Kuluçka Rehberi',
    duration: '17 Gün',
    temp: '37.7°C',
    humidity: '%60',
    hatchTemp: '37.2°C',
    hatchHumidity: '%75 - %80',
    expertTips: [
      'Bıldırcın yumurtalarının kabukları çok ince ve hassastır, bu nedenle yerleştirirken ve çevirirken dikkat edilmelidir.',
      '6. günde hızlı gelişim nedeniyle ilk döl kontrolü yapılır.',
      '15. günden itibaren çıkım dönemine girilir, çevirme kapatılır ve nem oranı %80\'e yükseltilir.',
      'Yumurtaların sivri uçları aşağı gelecek şekilde yerleştirilmesi önerilir.',
    ],
  },
  kaz: {
    title: 'Kaz Kuluçka Rehberi',
    duration: '30 Gün',
    temp: '37.5°C',
    humidity: '%55',
    hatchTemp: '37.0°C',
    hatchHumidity: '%80',
    expertTips: [
      'Kaz yumurtaları büyüktür ve yüksek ısı kapasitesine sahiptir. Sıcaklık 37.5°C civarında tutulmalıdır.',
      '4. günden itibaren günde 1-2 kez 10-15 dakika kabin kapağı açılarak soğutma ve ılık su püskürtme simülasyonu uygulanır.',
      '10. günde döl kontrolü yapılır.',
      '26. günden sonra çıkım kilitlenmesi başlar, çevirme durdurulur ve nem %80\'e çıkarılır.',
    ],
  },
};

export default function GuideScreen() {
  const { species, currentDay, dayNotes, saveDayNote } = useIncubation();
  const guide = SPECIES_GUIDES[species];

  const [noteText, setNoteText] = useState(dayNotes[currentDay] || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Gün değiştiğinde ilgili günün notunu inputa yükle
  useEffect(() => {
    setNoteText(dayNotes[currentDay] || '');
  }, [currentDay, dayNotes]);

  const handleSaveNotes = () => {
    saveDayNote(currentDay, noteText);
    setIsEditingNotes(false);
    Alert.alert('Başarılı', `${currentDay}. Gün notlarınız kaydedildi.`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{SPECIES_CONFIG[species].name} Rehberi & Notlar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Başlık Kartı */}
        <View style={styles.profileBox}>
          <View style={styles.avatar}>
            <Ionicons name="book" size={28} color="#FFF" />
          </View>
          <Text style={styles.name}>{guide.title}</Text>
          <Text style={styles.email}>Toplam Süre: {guide.duration} | Aktif Gün: {currentDay}. Gün</Text>
        </View>

        {/* Not Defteri Bölümü (Gün Entegreli) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{currentDay}. Gün Kuluçka Notu</Text>
          <TouchableOpacity onPress={() => (isEditingNotes ? handleSaveNotes() : setIsEditingNotes(true))}>
            <Text style={styles.editToggle}>{isEditingNotes ? 'Kaydet' : 'Düzenle'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteCard}>
          {isEditingNotes ? (
            <TextInput
              style={styles.noteInput}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              placeholder={`${currentDay}. gün için notlarınızı buraya yazın...`}
              placeholderTextColor={COLORS.subtext}
            />
          ) : (
            <Text style={styles.noteText}>
              {dayNotes[currentDay] || `${currentDay}. gün için henüz bir not girilmemiş. Düzenle butonuna basarak not ekleyebilirsiniz.`}
            </Text>
          )}
        </View>

        {/* İdeal Değerler Kartı */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{SPECIES_CONFIG[species].name} İdeal Değerleri</Text>
        
        <View style={styles.guideCard}>
          <View style={styles.guideHeader}>
            <Ionicons name="thermometer-outline" size={20} color={COLORS.primary} />
            <Text style={styles.guideTitle}>Gelişim Dönemi</Text>
          </View>
          <Text style={styles.guideText}>
            • Sıcaklık: {guide.temp}{'\n'}
            • Nem: {guide.humidity}
          </Text>
        </View>

        <View style={styles.guideCard}>
          <View style={styles.guideHeader}>
            <Ionicons name="water-outline" size={20} color={COLORS.primary} />
            <Text style={styles.guideTitle}>Çıkım Dönemi (Son Günler)</Text>
          </View>
          <Text style={styles.guideText}>
            • Sıcaklık: {guide.hatchTemp}{'\n'}
            • Nem: {guide.hatchHumidity}
          </Text>
        </View>

        {/* Uzman Tavsiyeleri */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{SPECIES_CONFIG[species].name} İçin Uzman İpuçları</Text>
        
        <View style={styles.guideCard}>
          {guide.expertTips.map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} style={{ marginTop: 2 }} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
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
  profileBox: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  email: {
    fontSize: 13,
    color: COLORS.subtext,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  editToggle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  noteCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  noteInput: {
    fontSize: 14,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  guideCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  guideText: {
    fontSize: 13,
    color: COLORS.subtext,
    lineHeight: 18,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.subtext,
    lineHeight: 18,
  },
});
