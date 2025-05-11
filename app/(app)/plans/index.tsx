import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/hooks';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { Clock, ChevronRight } from 'lucide-react-native';

export default function Plans() {
  const { plans } = useAppSelector((state) => state.plans);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.planCard}
      onPress={() => router.push(`/plans/${item.id}`)}
    >
      <View style={styles.planInfo}>
        <Text style={styles.planTitle}>{item.titre}</Text>
        <Text style={styles.planDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.planMeta}>
          <View style={styles.durationContainer}>
            <Clock size={16} color={Colors.textSecondary} />
            <Text style={styles.durationText}>{item.duree} séances</Text>
          </View>
          <Text style={styles.priceText}>{item.prix}€</Text>
        </View>
      </View>
      <ChevronRight size={24} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Plans</Text>
        <Text style={styles.subtitle}>
          Découvrez nos programmes de coaching personnalisés
        </Text>
      </View>

      <FlatList
        data={plans}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  planInfo: {
    flex: 1,
    marginRight: 16,
  },
  planTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
  },
  planDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  planMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  priceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary,
  },
});