import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/hooks';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { Lock, FileText, Video, Music, Image as ImageIcon, ChevronDown } from 'lucide-react-native';

type Filter = {
  type: string | null;
  license: 'all' | 'free' | 'premium';
};

type DropdownOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

export default function Resources() {
  const { resources } = useAppSelector((state) => state.resources);
  const [activeFilter, setActiveFilter] = useState<Filter>({
    type: null,
    license: 'all'
  });

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showLicenseDropdown, setShowLicenseDropdown] = useState(false);

  const typeOptions: DropdownOption[] = [
    { label: 'Types', value: 'null', icon: <FileText size={20} color={Colors.textSecondary} /> },
    { label: 'PDF', value: 'pdf', icon: <FileText size={20} color={Colors.textSecondary} /> },
    { label: 'Vidéo', value: 'video', icon: <Video size={20} color={Colors.textSecondary} /> },
    { label: 'Audio', value: 'audio', icon: <Music size={20} color={Colors.textSecondary} /> },
    { label: 'Image', value: 'image', icon: <ImageIcon size={20} color={Colors.textSecondary} /> },
  ];

  const licenseOptions: DropdownOption[] = [
    { label: 'Licences', value: 'all' },
    { label: 'Gratuit', value: 'free' },
    { label: 'Premium', value: 'premium', icon: <Lock size={20} color={Colors.textSecondary} /> },
  ];

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
        return <FileText size={16} color={Colors.textSecondary} />;
      case 'video':
        return <Video size={16} color={Colors.textSecondary} />;
      case 'audio':
        return <Music size={16} color={Colors.textSecondary} />;
      case 'image':
        return <ImageIcon size={16} color={Colors.textSecondary} />;
      default:
        return <FileText size={16} color={Colors.textSecondary} />;
    }
  };

  const renderDropdown = (
    options: DropdownOption[],
    visible: boolean,
    onClose: () => void,
    onSelect: (value: string) => void,
    currentValue: string | null
  ) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.dropdownContent}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownItem,
                currentValue === option.value && styles.dropdownItemSelected
              ]}
              onPress={() => {
                onSelect(option.value === 'null' ? null : option.value);
                onClose();
              }}
            >
              {option.icon}
              <Text style={[
                styles.dropdownItemText,
                currentValue === option.value && styles.dropdownItemTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
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
              <Lock size={12} color={Colors.white} />
            </View>
          )}
        </View>
        
        <View style={styles.resourceInfo}>
          <Text style={styles.resourceTitle} numberOfLines={1}>
            {item.titre}
          </Text>
          
          <View style={styles.resourceMeta}>
            <View style={styles.typeContainer}>
              {getTypeIcon(item.type)}
              <Text style={styles.typeText}>
                {item.type.toUpperCase()}
              </Text>
            </View>
            
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

  const getCurrentTypeLabel = () => {
    const option = typeOptions.find(opt => 
      (opt.value === 'null' && activeFilter.type === null) || 
      opt.value === activeFilter.type
    );
    return option?.label || 'Tous les types';
  };

  const getCurrentLicenseLabel = () => {
    const option = licenseOptions.find(opt => opt.value === activeFilter.license);
    return option?.label || 'Toutes les licences';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Ressources</Text>
        <Text style={styles.subtitle}>
          Découvrez nos ressources pour votre développement personnel
        </Text>
      </View>

      <View style={styles.filters}>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowTypeDropdown(true)}
          >
            <Text style={styles.dropdownText}>{getCurrentTypeLabel()}</Text>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowLicenseDropdown(true)}
          >
            <Text style={styles.dropdownText}>{getCurrentLicenseLabel()}</Text>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {renderDropdown(
        typeOptions,
        showTypeDropdown,
        () => setShowTypeDropdown(false),
        (value) => setActiveFilter(prev => ({ ...prev, type: value })),
        activeFilter.type
      )}

      {renderDropdown(
        licenseOptions,
        showLicenseDropdown,
        () => setShowLicenseDropdown(false),
        (value) => setActiveFilter(prev => ({ ...prev, license: value as Filter['license'] })),
        activeFilter.license
      )}

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
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
  },
  dropdownText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 8,
    width: '80%',
    maxHeight: '80%',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.primaryLight + '20',
  },
  dropdownItemText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
  dropdownItemTextSelected: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
  },
  listContent: {
    padding: 16,
  },
  resourceCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    height: 72,
  },
  imageContainer: {
    width: 72,
    position: 'relative',
  },
  resourceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  premiumBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.primary,
    padding: 4,
    borderRadius: 12,
  },
  resourceInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  resourceTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  priceText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  freeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.success,
  },
});