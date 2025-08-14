import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { signIn } from '../app/features/authSlice'; // Import signIn action
import { API_BASE_URL_JO } from '../config';


// Simple Toast component (copied from SignUpScreen for consistency)
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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const showCustomToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const hideCustomToast = () => {
    setShowToast(false);
    setToastMessage('');
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL_JO}/users/login`, {
        email,
        password,
      });

      const token = res.data.token;
      if (token) {
        // Dispatch the signIn action with the token
        dispatch(signIn({ token }));
        showCustomToast('Login successful! Welcome back.');
      } else {
        showCustomToast('Login Failed: Token not received. Please try again.');
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      showCustomToast(`Login Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue your fitness journey</Text>

      <View style={styles.formWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={styles.buttonWrapper}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#5856D6", "#8A56D6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text style={styles.switchText}>
        Don't have an account?{' '}
        <Text
          onPress={() => navigation.navigate('SignUp')}
          style={styles.linkText}
        >
          Sign up
        </Text>
      </Text>
      <Toast message={toastMessage} isVisible={showToast} onHide={hideCustomToast} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 30,
  },
  formWrapper: {
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#555',
  },
  buttonWrapper: {
    marginTop: 10,
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
  switchText: {
    textAlign: 'center',
    color: '#B0B0B0',
    marginTop: 20,
    fontSize: 14,
  },
  linkText: {
    color: '#5856D6',
    fontWeight: '600',
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