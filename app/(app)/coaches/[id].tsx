import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/hooks';
import Colors from '@/constants/colors';
import { ArrowLeft, Star, Book, Mail, Phone, X } from 'lucide-react-native';
import Button from '@/components/common/Button';
import { addReview } from '@/store/slices/reviewSlice';

export default function CoachDetail() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { coaches } = useAppSelector((state) => state.user);
  const { reviews } = useAppSelector((state) => state.reviews);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const coach = coaches.find(c => c.id.toString() === id);
  const coachReviews = reviews.filter(r => r.coach_id.toString() === id);

  if (!coach) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Coach non trouvé</Text>
      </SafeAreaView>
    );
  }

  const handleAddReview = async () => {
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await dispatch(addReview({
        coach_id: coach.id!,
        rating,
        description
      })).unwrap();
      setShowReviewModal(false);
      setRating(5);
      setDescription('');
    } catch (error) {
      console.error('Failed to add review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ReviewModal = () => (
    <Modal
      visible={showReviewModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowReviewModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ajouter un avis</Text>
            <TouchableOpacity
              onPress={() => setShowReviewModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setRating(value)}
                style={styles.starButton}
              >
                <Star
                  size={32}
                  color={Colors.secondary}
                  fill={value <= rating ? Colors.secondary : 'none'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.reviewInput}
            placeholder="Partagez votre expérience..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <Button
            title="Publier"
            onPress={handleAddReview}
            loading={isSubmitting}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
  );

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

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Avis ({coachReviews.length})</Text>
              <Button
                title="Ajouter un avis"
                onPress={() => setShowReviewModal(true)}
                type="outline"
                style={styles.addReviewButton}
              />
            </View>
            
            {coachReviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{ uri: review.user?.photo }}
                    style={styles.reviewerImage}
                  />
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>
                      {review.user?.prenom} {review.user?.nom}
                    </Text>
                    <View style={styles.ratingDisplay}>
                      <Star size={16} color={Colors.secondary} fill={Colors.secondary} />
                      <Text style={styles.ratingText}>{review.rating}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.description}</Text>
              </View>
            ))}
          </View>

          <Button
            title="Contacter le coach"
            onPress={() => {}}
            style={styles.contactButton}
          />
        </View>
      </ScrollView>

      <ReviewModal />
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    minWidth: 120,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  reviewText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  starButton: {
    padding: 4,
  },
  reviewInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 'auto',
  },
});