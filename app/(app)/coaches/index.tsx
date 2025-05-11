import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/hooks';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { Star } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - (24 * 2) - (CARD_MARGIN * 2)) / 2;

export default function Coaches() {
  const { coaches } = useAppSelector((state) => state.user);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.coachCard}
      onPress={() => router.push(`/coaches/${item.id}`)}
    >
      <Image source={{ uri: item.photo }} style={styles.coachImage} />
      <View style={styles.coachInfo}>
        <Text style={styles.coachName} numberOfLines={1}>
          {item.prenom} {item.nom}
        </Text>
        <Text style={styles.coachSpecialities} numberOfLines={1}>
          {item.specialites[0]}
        </Text>
        <View style={styles.coachStats}>
          <View style={styles.ratingContainer}>
            <Star size={14} color={Colors.secondary} fill={Colors.secondary} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.coursCount}>{item.coursCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Coachs</Text>
        <Text style={styles.subtitle}>
          Découvrez nos coachs professionnels et leur expertise
        </Text>
      </View>

      <FlatList
        data={coaches}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: Colors.white,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 8,
  },
  coachCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  coachImage: {
    width: '100%',
    height: CARD_WIDTH,
    resizeMode: 'cover',
  },
  coachInfo: {
    padding: 12,
  },
  coachName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  coachSpecialities: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  coachStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.text,
    marginLeft: 4,
  },
  coursCount: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});