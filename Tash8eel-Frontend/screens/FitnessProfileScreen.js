import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_BASE_URL_JO } from '../config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../app/features/userSlice';

// --- Toast Component (Copied from ProfileScreen for consistency) ---
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
// --- End Toast Component ---


export default function FitnessProfileScreen({ navigation, route }) {
    // CORRECTED: Get token and dispatch from Redux
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);

    const [form, setForm] = useState({
        name: '',
        age: '',
        height: '',
        weight: '',
        goal: '',
        activityLevel: '',
    });
    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Helper function for showing toast messages
    const showCustomToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const hideCustomToast = () => {
        setShowToast(false);
        setToastMessage('');
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

    const handleSubmit = async () => {
        if (!form.height || !form.weight || !form.goal || !form.activityLevel) {
            return showCustomToast('Please fill out all required fields (Height, Weight, Goal, Activity Level).');
        }

        const numericFields = ['age', 'height', 'weight'];
        for (const field of numericFields) {
            if (form[field] && isNaN(Number(form[field]))) {
                showCustomToast(`${field.charAt(0).toUpperCase() + field.slice(1)} must be a number.`);
                return;
            }
        }

        setSaving(true);
        try {
            await axios.put(
                `${API_BASE_URL_JO}/users/profile`,
                {
                    name: form.name || '',
                    age: form.age ? Number(form.age) : undefined,
                    height: Number(form.height),
                    weight: Number(form.weight),
                    goal: form.goal,
                    activityLevel: form.activityLevel,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            showCustomToast('Fitness profile completed and saved!');

            // This dispatch is the key to navigation. It triggers a re-fetch of the
            // user's profile, which updates the Redux state. The AppNavigator
            // then detects the updated state and automatically navigates the user
            // to the main tabs.
            dispatch(fetchUserProfile(token));
            navigation.replace('MainTabs');

        } catch (err) {
            // ENHANCED ERROR LOGGING
            console.error('Failed to save fitness profile:', err);
            if (err.response) {
                console.error('Server Response Data:', JSON.stringify(err.response.data, null, 2));
            }
            const errorMessage = err?.response?.data?.message || 'Failed to save profile. Please try again.';
            showCustomToast(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.rootContainer}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>Complete Your Fitness Profile</Text>

                <View style={styles.card}>
                    {[
                        { label: 'Name', key: 'name', placeholder: 'Enter your name', keyboardType: 'default' },
                        { label: 'Age', key: 'age', placeholder: 'Enter your age', keyboardType: 'numeric' },
                        { label: 'Height (cm)', key: 'height', placeholder: 'e.g. 175', keyboardType: 'numeric' },
                        { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 70', keyboardType: 'numeric' },
                    ].map(({ label, key, placeholder, keyboardType }) => (
                        <View key={key} style={styles.fieldContainer}>
                            <Text style={styles.label}>{label}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={placeholder}
                                value={form[key]}
                                keyboardType={keyboardType || 'default'}
                                onChangeText={(val) => setForm({ ...form, [key]: val })}
                                placeholderTextColor="#888"
                            />
                        </View>
                    ))}

                    <Text style={styles.label}>Goal</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={form.goal}
                            onValueChange={(val) => setForm({ ...form, goal: val })}
                            dropdownIconColor="#B0B0B0"
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                        >
                            {goalOptions.map(option => (
                                <Picker.Item key={option.value} label={option.label} value={option.value} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Activity Level</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={form.activityLevel}
                            onValueChange={(val) => setForm({ ...form, activityLevel: val })}
                            dropdownIconColor="#B0B0B0"
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                        >
                            {activityLevelOptions.map(option => (
                                <Picker.Item key={option.value} label={option.label} value={option.value} />
                            ))}
                        </Picker>
                    </View>

                    <TouchableOpacity onPress={handleSubmit} activeOpacity={0.9} disabled={saving}>
                        <LinearGradient
                            colors={['#5856D6', '#8A56D6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.button}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Save Profile</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast message={toastMessage} isVisible={showToast} onHide={hideCustomToast} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#1C1C1E',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        fontSize: 30,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#3A3A3C',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    fieldContainer: {
        marginBottom: 14,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#B0B0B0',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: '#FFFFFF',
        height: 50,
        borderWidth: 1,
        borderColor: '#555',
    },
    pickerContainer: {
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        marginBottom: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#555',
    },
    picker: {
        height: 50,
        color: '#FFFFFF',
    },
    pickerItem: {
        color: '#FFFFFF',
        backgroundColor: '#2C2C2E',
    },
    button: {
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
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
