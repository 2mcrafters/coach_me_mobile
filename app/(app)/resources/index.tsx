import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/hooks';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { Lock, FileText, Video, Music, Image as ImageIcon } from 'lucide-react-native';

export default function Resources() {
  const { resources } = useAppSelector((state) => state.resources);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} color={Colors.textSecondary} />;
      case 'video':
        return <Video size={20} color={Colors.textSecondary} />;
      case 'audio':
        return <Music size={20} color={Colors.textSecondary} />;
      case 'image':
        return <ImageIcon size={20} color={Colors.textSecondary} />;
      default:
        return <FileText size={20} color={Colors.textSecondary} />;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resourceCard}
      onPress={() => router.push(`/resources/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.photo }} style={styles.resourceImage} />
          {item.estPremium && (
            <View style={styles.premiumBadge}>
              <Lock size={16} color={Colors.white} />
            </View>
          )}
        </View>
        
        <View style={styles.resourceInfo}>
          <View style={styles.resourceHeader}>
            <Text style={styles.resourceTitle} numberOfLines={2}>
              {item.titre}
            </Text>
            <View style={styles.typeContainer}>
              {getTypeIcon(item.type)}
              <Text style={styles.typeText}>
                {item.type.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.resourceMeta}>
            {item.prix ? (
              <Text style={styles.priceText}>{item.prix}€</Text>
            ) : (
              <Text style={styles.freeText}>Gratuit</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Ressources</Text>
        <Text style={styles.subtitle}>
          Découvrez nos ressources pour votre développement personnel
        </Text>
      </View>

      <FlatList
        data={resources}
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
  resourceCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    height: 140,
  },
  imageContainer: {
    width: 140,
    position: 'relative',
  },
  resourceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 20,
  },
  resourceInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  resourceHeader: {
    flex: 1,
  },
  resourceTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  typeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  resourceMeta: {
    marginTop: 8,
  },
  priceText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: Colors.primary,
  },
  freeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: Colors.success,
  },
});