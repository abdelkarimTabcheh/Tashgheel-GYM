import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { API_BASE_URL_JO } from '../config';
import { useDispatch } from 'react-redux';
import { signIn } from '../app/features/authSlice'; // <-- Changed import from setToken to signIn

// Simple Toast component
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
        Animated.delay(2000), // Show for 2 seconds
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

export default function SignUpScreen({ navigation }) {
  const dispatch = useDispatch();
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

  const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
  });

  const handleSignup = async (values, { setSubmitting }) => {
    const signupUrl = `${API_BASE_URL_JO}/users/signup`;

    try {
      const res = await axios.post(signupUrl, {
        email: values.email,
        password: values.password,
      });

      if (res.status === 201) {
        // Assume the server returns the token directly from the signup endpoint
        const { token } = res.data;
        if (token) {
          showCustomToast('Signup successful! Loading your profile...');

          // The key fix: use the new 'signIn' action creator
          dispatch(signIn({ token }));

        } else {
          showCustomToast('Signup successful, but no token received. Please log in.');
        }
      } else {
        showCustomToast('Signup Failed: An unexpected error occurred.');
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Signup failed. Please try again.';
      showCustomToast(`Signup Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Create Your Account</Text>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSignup}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View style={styles.formWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#888"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#888"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              placeholderTextColor="#888"
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={styles.buttonWrapper}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#5856D6", "#8A56D6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <Text style={styles.switchText}>
        Already have an account?
        <Text onPress={() => navigation.goBack()} style={styles.linkText}> Login</Text>
      </Text>
      <Toast message={toastMessage} isVisible={showToast} onHide={hideCustomToast} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#1C1C1E'
  },
  title: {
    fontSize: 30,
    fontWeight: '700', marginBottom: 30,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  formWrapper: {
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8
  },
  input: {
    height: 50,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF'
  },
  error: {
    color: '#FF6B6B',
    fontSize: 13,
    marginBottom: 10
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden'
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  switchText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#B0B0B0'
  },
  linkText: {
    color: '#5856D6',
    fontWeight: '600'
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
    zIndex: 1000, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  toastText: {
    color: '#fff', fontSize: 14,
    textAlign: 'center'
  },
});
