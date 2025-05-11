import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppSelector } from '@/hooks';
import Colors from '@/constants/colors';
import { ArrowLeft, Clock, FileText, Video, Music, Image as ImageIcon } from 'lucide-react-native';
import Button from '@/components/common/Button';

export default function PlanDetail() {
  const { id } = useLocalSearchParams();
  const { plans } = useAppSelector((state) => state.plans);
  const plan = plans.find(p => p.id.toString() === id);

  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Plan non trouvé</Text>
      </SafeAreaView>
    );
  }

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

        <View style={styles.content}>
          <Text style={styles.title}>{plan.titre}</Text>
          
          <View style={styles.metaInfo}>
            <View style={styles.durationContainer}>
              <Clock size={20} color={Colors.textSecondary} />
              <Text style={styles.durationText}>{plan.duree} séances</Text>
            </View>
            <Text style={styles.priceText}>{plan.prix}€</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{plan.description}</Text>
          </View>

          {plan.ressources && plan.ressources.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ressources incluses</Text>
              {plan.ressources.map((resource) => (
                <TouchableOpacity
                  key={resource.id}
                  style={styles.resourceCard}
                  onPress={() => router.push(`/resources/${resource.id}`)}
                >
                  <Image source={{ uri: resource.photo }} style={styles.resourceImage} />
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceTitle}>{resource.titre}</Text>
                    <View style={styles.resourceType}>
                      {getTypeIcon(resource.type)}
                      <Text style={styles.resourceTypeText}>
                        {resource.type.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Button
            title="Souscrire au plan"
            onPress={() => {}}
            style={styles.subscribeButton}
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
  content: {
    padding: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  priceText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.primary,
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
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  resourceImage: {
    width: 80,
    height: 80,
  },
  resourceInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  resourceTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  resourceType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceTypeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  subscribeButton: {
    marginTop: 24,
  },
});