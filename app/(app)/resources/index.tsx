import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/hooks';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { Lock, FileText, Video, Music, Image as ImageIcon } from 'lucide-react-native';

type Filter = {
  type: string | null;
  license: 'all' | 'free' | 'premium';
};

export default function Resources() {
  const { resources } = useAppSelector((state) => state.resources);
  const [activeFilter, setActiveFilter] = useState<Filter>({
    type: null,
    license: 'all'
  });

  const types = ['pdf', 'video', 'audio', 'image'];

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesType = !activeFilter.type || resource.type === activeFilter.type;
      const matchesLicense = activeFilter.license === 'all' || 
        (activeFilter.license === 'premium' && resource.estPremium) ||
        (activeFilter.license === 'free' && !resource.estPremium);
      
      return matchesType && matchesLicense;
    });
  }, [resources, activeFilter]);

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

  const renderTypeFilter = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>Type</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !activeFilter.type && styles.filterChipActive
          ]}
          onPress={() => setActiveFilter(prev => ({ ...prev, type: null }))}
        >
          <Text style={[
            styles.filterChipText,
            !activeFilter.type && styles.filterChipTextActive
          ]}>Tous</Text>
        </TouchableOpacity>
        {types.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              activeFilter.type === type && styles.filterChipActive
            ]}
            onPress={() => setActiveFilter(prev => ({ ...prev, type }))}
          >
            <View style={styles.filterChipContent}>
              {getTypeIcon(type)}
              <Text style={[
                styles.filterChipText,
                activeFilter.type === type && styles.filterChipTextActive
              ]}>{type.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderLicenseFilter = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>Licence</Text>
      <View style={styles.licenseFilters}>
        {[
          { id: 'all', label: 'Tous' },
          { id: 'free', label: 'Gratuit' },
          { id: 'premium', label: 'Premium' }
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.licenseChip,
              activeFilter.license === item.id && styles.filterChipActive
            ]}
            onPress={() => setActiveFilter(prev => ({ 
              ...prev, 
              license: item.id as Filter['license']
            }))}
          >
            {item.id === 'premium' && (
              <Lock size={16} color={activeFilter.license === 'premium' ? Colors.white : Colors.textSecondary} style={styles.licenseIcon} />
            )}
            <Text style={[
              styles.filterChipText,
              activeFilter.license === item.id && styles.filterChipTextActive
            ]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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

      <View style={styles.filters}>
        {renderTypeFilter()}
        {renderLicenseFilter()}
      </View>

      <FlatList
        data={filteredResources}
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
  filters: {
    backgroundColor: Colors.white,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  filterScrollContent: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  licenseFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  licenseChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  licenseIcon: {
    marginRight: 4,
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