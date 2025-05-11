import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppSelector } from '@/hooks';
import Colors from '@/constants/colors';
import { ArrowLeft, Star, Book, Mail, Phone } from 'lucide-react-native';
import Button from '@/components/common/Button';

export default function CoachDetail() {
  const { id } = useLocalSearchParams();
  const { coaches } = useAppSelector((state) => state.user);
  const coach = coaches.find(c => c.id.toString() === id);

  if (!coach) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Coach non trouvé</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <Image source={{ uri: coach.photo }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{coach.prenom} {coach.nom}</Text>
            <Text style={styles.specialities}>
              {coach.specialites.join(' • ')}
            </Text>
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Star size={20} color={Colors.secondary} fill={Colors.secondary} />
                <Text style={styles.statValue}>{coach.rating}</Text>
                <Text style={styles.statLabel}>(54k+)</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Book size={20} color={Colors.textSecondary} />
                <Text style={styles.statValue}>{coach.coursCount}</Text>
                <Text style={styles.statLabel}>Cours</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.bio}>{coach.bio}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Mail size={20} color={Colors.textSecondary} />
                <Text style={styles.contactText}>{coach.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <Phone size={20} color={Colors.textSecondary} />
                <Text style={styles.contactText}>{coach.telephone}</Text>
              </View>
            </View>
          </View>

          <Button
            title="Contacter le coach"
            onPress={() => {}}
            style={styles.contactButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 4,
  },
  specialities: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text,
    marginLeft: 8,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 12,
  },
  bio: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  contactInfo: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  contactButton: {
    marginTop: 24,
  },
});