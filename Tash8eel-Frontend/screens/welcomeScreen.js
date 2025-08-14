import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>FitTracker</Text>
          <Text style={styles.subtitle}>Your Fitness Journey Starts Here</Text>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={{
              // Replaced with a more neutral placeholder image for better dark theme integration
              uri: 'https://as2.ftcdn.net/v2/jpg/00/99/82/15/1000_F_99821575_nVEHTBXzUnTcLIKN6yOymAWAnFwEybGb.jpg',
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Transform your body, mind, and lifestyle with personalized workouts and nutrition tracking.
          </Text>
        </View>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')} // Direct navigation to the Login screen
            activeOpacity={0.8}
            style={styles.getStartedButtonWrapper}
          >
            <LinearGradient
              colors={['#5856D6', '#8A56D6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.getStartedButton}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5856D6',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  image: {
    width: width * 0.85,
    height: height * 0.35,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  descriptionSection: {
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedButtonWrapper: {
    borderRadius: 30,
    width: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  getStartedButton: {
    paddingVertical: 16,
    paddingHorizontal: 60,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default WelcomeScreen;
