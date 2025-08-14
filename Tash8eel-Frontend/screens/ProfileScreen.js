import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL_JO } from '../config';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { setProfile } from '../app/features/userSlice';
import { signOut } from '../app/features/authSlice'; // Import signOut action
import Header from '../components/Header';
import StreakStatsWidget from '../components/StreakStatsWidget';

// --- Toast Component (Reused from SignUpScreen for consistency) ---
const Toast = ({ message, isVisible, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [isVisible, fadeAnim, onHide]);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

// NEW: Streak Stats Component
const StreakStats = ({ currentStreak, longestStreak }) => {
  return (
    <View style={styles.streakStatsContainer}>
      <View style={styles.streakCard}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <Text style={styles.streakNumber}>{currentStreak || 0}</Text>
        <Text style={styles.streakLabel}>Current Streak</Text>
      </View>
      <View style={styles.streakCard}>
        <Text style={styles.streakEmoji}>🏆</Text>
        <Text style={styles.streakNumber}>{longestStreak || 0}</Text>
        <Text style={styles.streakLabel}>Best Streak</Text>
      </View>
    </View>
  );
};

export default function ProfileScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const reduxProfile = useSelector(state => state.user.profile);

  const [profile, setProfileState] = useState({
    name: '',
    age: '',
    bio: '',
    avatarUrl: '',
    height: '',
    weight: '',
    goal: '',
    activityLevel: '',
    currentStreak: 0,
    longestStreak: 0,
  });

  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showCustomToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const hideCustomToast = () => {
    setShowToast(false);
    setToastMessage('');
  };

  // NEW: Handle Sign Out
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(signOut());
            showCustomToast('Signed out successfully');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const goalOptions = [
    { label: 'Select Goal', value: '' },
    { label: 'Lose Weight', value: 'lose_weight' },
    { label: 'Build Muscle', value: 'build_muscle' },
    { label: 'Maintain Weight', value: 'maintain_weight' },
    { label: 'Increase Endurance', value: 'increase_endurance' },
  ];

  const activityLevelOptions = [
    { label: 'Select Activity Level', value: '' },
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly Active', value: 'lightly_active' },
    { label: 'Moderately Active', value: 'moderately_active' },
    { label: 'Very Active', value: 'very_active' },
    { label: 'Extra Active', value: 'extra_active' },
  ];

  // Use useFocusEffect to fetch data every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const fetchProfile = async () => {
        if (!token) {
          showCustomToast('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }

        setLoading(true);
        try {
          const res = await axios.get(`${API_BASE_URL_JO}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (isMounted) {
            setProfileState({
              name: res.data.name || '',
              age: res.data.age ? String(res.data.age) : '',
              bio: res.data.bio || '',
              avatarUrl: res.data.avatarUrl || '',
              height: res.data.height ? String(res.data.height) : '',
              weight: res.data.weight ? String(res.data.weight) : '',
              goal: res.data.goal || '',
              activityLevel: res.data.activityLevel || '',
              currentStreak: res.data.currentStreak || 0,
              longestStreak: res.data.longestStreak || 0,
            });
          }
        } catch (error) {
          console.error('Failed to load profile:', error.response?.data || error.message);
          if (isMounted) {
            showCustomToast('Failed to load profile. Please try again later.');
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchProfile();

      return () => {
        isMounted = false;
      };
    }, [token])
  );

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorCode, response.errorMessage);
          if (response.errorCode === 'permission') {
            showCustomToast('Permission Denied: Please grant photo library access to change your avatar.');
          } else {
            showCustomToast(`Image picker error: ${response.errorMessage}`);
          }
        } else if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri);
        }
      }
    );
  };

  const handleSave = async () => {
    const numericFields = ['age', 'height', 'weight'];
    for (const field of numericFields) {
      if (profile[field] && isNaN(Number(profile[field]))) {
        showCustomToast(`${field.charAt(0).toUpperCase() + field.slice(1)} must be a valid number.`);
        return;
      }
    }

    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, val]) => {
        if (numericFields.includes(key) && val !== '') {
          formData.append(key, Number(val));
        } else if (key !== 'avatarUrl' && key !== 'currentStreak' && key !== 'longestStreak') {
          formData.append(key, val || '');
        }
      });

      if (imageUri) {
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('profileImage', {
          uri: imageUri,
          name: filename,
          type,
        });
      }

      const response = await axios.put(`${API_BASE_URL_JO}/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      showCustomToast('Profile updated successfully!');

      dispatch(setProfile({
        name: response.data.user.name || '',
        age: response.data.user.age ? String(response.data.user.age) : '',
        bio: response.data.user.bio || '',
        avatarUrl: response.data.user.avatarUrl || '',
        height: response.data.user.height ? String(response.data.user.height) : '',
        weight: response.data.user.weight ? String(response.data.user.weight) : '',
        goal: response.data.user.goal || '',
        activityLevel: response.data.user.activityLevel || '',
        currentStreak: response.data.user.currentStreak || 0,
        longestStreak: response.data.user.longestStreak || 0,
      }));

      setProfileState({
        name: response.data.user.name || '',
        age: response.data.user.age ? String(response.data.user.age) : '',
        bio: response.data.user.bio || '',
        avatarUrl: response.data.user.avatarUrl || '',
        height: response.data.user.height ? String(response.data.user.height) : '',
        weight: response.data.user.weight ? String(response.data.user.weight) : '',
        goal: response.data.user.goal || '',
        activityLevel: response.data.user.activityLevel || '',
        currentStreak: response.data.user.currentStreak || 0,
        longestStreak: response.data.user.longestStreak || 0,
      });
      setImageUri(null);
    } catch (error) {
      console.error('Failed to update profile:', error.response?.data || error.message);
      const errorMessage = error?.response?.data?.message || 'Failed to update profile. Please try again.';
      showCustomToast(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const getProfileImageSource = () => {
    if (imageUri) {
      return { uri: imageUri };
    }
    if (profile.avatarUrl) {
      return { uri: `${API_BASE_URL_JO}${profile.avatarUrl}?t=${Date.now()}` };
    }
    return require('../assets/images/default-user.png');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5856D6" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1C1C1E' }}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Header title="Profile" onBackPress={() => navigation.goBack()} />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.profileHeaderSection}>
            <TouchableOpacity onPress={pickImage} style={styles.imageWrapper} activeOpacity={0.8}>
              <Image source={getProfileImageSource()} style={styles.avatar} />
              <View style={styles.cameraIconContainer}>
                <Text style={styles.cameraIcon}>📸</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.profileName}>{profile.name || 'Your Name'}</Text>

            {/* NEW: Streak Stats Display */}
            <StreakStatsWidget
              currentStreak={profile.currentStreak}
              longestStreak={profile.longestStreak}
              totalChallenges={profile.totalChallengesCompleted || 0}
              onPress={() => navigation.navigate('StreakLeaderboard')}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Name"
              placeholderTextColor="#888"
              value={profile.name}
              multiline
              onChangeText={(val) => setProfileState({ ...profile, name: val })}
            />
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor="#888"
              value={profile.age}
              keyboardType="numeric"
              onChangeText={(val) => setProfileState({ ...profile, age: val })}
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about yourself"
              placeholderTextColor="#888"
              value={profile.bio}
              multiline
              onChangeText={(val) => setProfileState({ ...profile, bio: val })}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fitness Details</Text>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 175"
              placeholderTextColor="#888"
              value={profile.height}
              keyboardType="numeric"
              onChangeText={(val) => setProfileState({ ...profile, height: val })}
            />

            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 70"
              placeholderTextColor="#888"
              value={profile.weight}
              keyboardType="numeric"
              onChangeText={(val) => setProfileState({ ...profile, weight: val })}
            />

            <Text style={styles.label}>Goal</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={profile.goal}
                onValueChange={(val) => setProfileState({ ...profile, goal: val })}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                mode="dropdown"
              >
                {goalOptions.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Activity Level</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={profile.activityLevel}
                onValueChange={(val) => setProfileState({ ...profile, activityLevel: val })}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                mode="dropdown"
              >
                {activityLevelOptions.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Save Profile Button */}
          <TouchableOpacity onPress={handleSave} style={styles.buttonWrapper} disabled={saving}>
            <LinearGradient
              colors={["#5856D6", "#8A56D6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Profile</Text>}
            </LinearGradient>
          </TouchableOpacity>

          {/* NEW: Sign Out Button */}
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButtonWrapper}>
            <View style={styles.signOutButton}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast message={toastMessage} isVisible={showToast} onHide={hideCustomToast} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 60,
  },
  profileHeaderSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageWrapper: {
    marginBottom: 10,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#5856D6',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5856D6',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#1C1C1E',
  },
  cameraIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 5,
    marginBottom: 15,
  },
  // NEW: Streak Stats Styles
  streakStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  streakCard: {
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  streakEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#B0B0B0',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4B4B4B',
    paddingBottom: 10,
  },
  label: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#555',
    height: 50,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#555',
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
  },
  pickerItem: {
    color: '#FFFFFF',
    backgroundColor: '#2C2C2E',
  },
  buttonWrapper: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // NEW: Sign Out Button Styles
  signOutButtonWrapper: {
    marginTop: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF453A',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  loadingText: {
    color: '#B0B0B0',
    marginTop: 10,
    fontSize: 16,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 24,
    right: 24,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});