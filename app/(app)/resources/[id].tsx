import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppSelector } from '@/hooks';
import Colors from '@/constants/colors';
import { Lock, ArrowLeft, FileText, Video, Music, Image as ImageIcon } from 'lucide-react-native';
import Button from '@/components/common/Button';

export default function ResourceDetail() {
  const { id } = useLocalSearchParams();
  const { resources } = useAppSelector((state) => state.resources);
  const resource = resources.find(r => r.id.toString() === id);

  if (!resource) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Ressource non trouvée</Text>
      </SafeAreaView>
    );
  }

  const getTypeIcon = () => {
    switch (resource.type) {
      case 'pdf':
        return <FileText size={24} color={Colors.textSecondary} />;
      case 'video':
        return <Video size={24} color={Colors.textSecondary} />;
      case 'audio':
        return <Music size={24} color={Colors.textSecondary} />;
      case 'image':
        return <ImageIcon size={24} color={Colors.textSecondary} />;
      default:
        return <FileText size={24} color={Colors.textSecondary} />;
    }
  };

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

        <Image source={{ uri: resource.photo }} style={styles.coverImage} />

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{resource.titre}</Text>
            {resource.estPremium && (
              <View style={styles.premiumBadge}>
                <Lock size={16} color={Colors.white} />
              </View>
            )}
          </View>

          <View style={styles.metaInfo}>
            <View style={styles.typeContainer}>
              {getTypeIcon()}
              <Text style={styles.typeText}>
                {resource.type.toUpperCase()}
              </Text>
            </View>
            {resource.prix ? (
              <Text style={styles.priceText}>{resource.prix}€</Text>
            ) : (
              <Text style={styles.freeText}>Gratuit</Text>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>

          <Button
            title={resource.estPremium ? "Acheter maintenant" : "Accéder"}
            onPress={() => {}}
            style={styles.actionButton}
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
  coverImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.text,
    flex: 1,
    marginRight: 16,
  },
  premiumBadge: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 20,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  priceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.primary,
  },
  freeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  actionButton: {
    marginTop: 16,
  },
});