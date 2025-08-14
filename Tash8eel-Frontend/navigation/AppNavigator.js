import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../app/features/userSlice';
import { signOut } from '../app/features/authSlice';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import NotificationBadge from '../components/NotificationBadge';

// Screens
import WelcomeScreen from '../screens/welcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TimerScreen from '../screens/TimerScreen';
import FitnessProfileScreen from '../screens/FitnessProfileScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import WorkoutListScreen from '../screens/workoutListScreen';
import WorkoutDetailScreen from '../screens/workoutDetailScreen';
import WorkoutCategoriesScreen from '../screens/workoutCategoriesScreen';
import ChatBotScreen from '../screens/chatBotScreen';
import ChallengeDetailScreen from '../screens/ChallengeDetailScreen';
import WorkoutDtlScreen from '../screens/workoutDtlScreen';
import DayDetailScreen from '../screens/DayDetailScreen';
import StreakLeaderboardScreen from '../screens/StreakLeaderboardScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const WorkoutStack = createNativeStackNavigator();
const ChallengeStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

// A separate stack for the Welcome, Login, and SignUp screens
function AuthStackNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
        </AuthStack.Navigator>
    );
}

function ChallengeStackNavigator() {
    return (
        <ChallengeStack.Navigator screenOptions={{ headerShown: false }}>
            <ChallengeStack.Screen
                name="ChallengeList"
                component={ChallengeScreen}
                options={{ title: 'Challenges' }}
            />
            <ChallengeStack.Screen
                name="ChallengeDetail"
                component={ChallengeDetailScreen}
                options={{ title: 'Challenge Details' }}
            />
            <ChallengeStack.Screen
                name="DayDetail"
                component={DayDetailScreen}
                options={({ route }) => ({ title: `Day ${route.params.day}` })}
            />
            <ChallengeStack.Screen
                name="WorkoutDtl"
                component={WorkoutDtlScreen}
                options={({ route }) => ({ title: route.params.workout.name })}
            />
        </ChallengeStack.Navigator>
    );
}

function WorkoutStackNavigator() {
    return (
        <WorkoutStack.Navigator screenOptions={{ headerShown: false }}>
            <WorkoutStack.Screen name="WorkoutCategories" component={WorkoutCategoriesScreen} />
            <WorkoutStack.Screen name="WorkoutList" component={WorkoutListScreen} />
            <WorkoutStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        </WorkoutStack.Navigator>
    );
}

function MainTabsNavigator() {
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Home':
                            iconName = 'home-outline';
                            break;
                        case 'Challenges':
                            iconName = 'trophy-outline';
                            break;
                        case 'Workouts':
                            iconName = 'barbell-outline';
                            break;
                        case 'StreakLeaderboard':
                            iconName = 'bar-chart-outline';
                            break;
                        case 'Timer':
                            iconName = 'timer-outline';
                            break;
                        case 'Profile':
                            iconName = 'person-outline';
                            break;
                        default:
                            iconName = 'ellipse-outline';
                    }
                    
                    const icon = <Ionicons name={iconName} size={size + 2} color={color} />;
                    
                    // Add notification badge to Profile tab
                    if (route.name === 'Profile') {
                        return (
                            <View style={{ position: 'relative' }}>
                                {icon}
                                <NotificationBadge />
                            </View>
                        );
                    }
                    
                    return icon;
                },
                tabBarActiveTintColor: '#5856D6',
                tabBarInactiveTintColor: '#A0A0A0',
                tabBarStyle: {
                    backgroundColor: '#121212',
                    height: 60 + insets.bottom,
                    paddingBottom: 4 + insets.bottom,
                    paddingTop: 10,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 5,
                    fontWeight: '600',
                    textTransform: 'none',
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarLabel: '',
            }}
            />
            <Tab.Screen name="Challenges" component={ChallengeStackNavigator} options={{
                tabBarLabel: '',
            }} />
            <Tab.Screen name="Workouts" component={WorkoutStackNavigator} options={{
                tabBarLabel: '',
            }} />
            <Tab.Screen name="StreakLeaderboard" component={StreakLeaderboardScreen} options={{
                tabBarLabel: '',
            }} />
            <Tab.Screen name="Timer" component={TimerScreen} options={{
                tabBarLabel: '',
            }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{
                tabBarLabel: '',
            }} />
        </Tab.Navigator>
    );
}

// This component will handle the initial data fetching and navigation
const MainAppLoadingScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const userProfileStatus = useSelector(state => state.user.status);
    const userProfile = useSelector(state => state.user.profile);
    const userProfileError = useSelector(state => state.user.error);

    // Initial data fetch
    useEffect(() => {
        if (token && userProfileStatus === 'idle') {
            dispatch(fetchUserProfile(token));
        }
    }, [dispatch, token, userProfileStatus]);

    // Navigate once data is fetched
    useEffect(() => {
        if (userProfileStatus === 'succeeded') {
            // Check if user has completed the fitness profile
            if (userProfile && userProfile.height && userProfile.weight) {
                navigation.replace('MainTabs');
            } else {
                navigation.replace('FitnessProfile');
            }
        }
        if (userProfileStatus === 'failed') {
            console.error("Failed to fetch user profile:", userProfileError);
            dispatch(signOut());
        }
    }, [userProfileStatus, navigation, dispatch, userProfile, userProfileError]);

    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5856D6" />
            <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
    );
};

// Main authenticated stack that includes the loading screen, tabs, and other screens
function MainStackNavigator() {
    return (
        <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen name="MainAppLoading" component={MainAppLoadingScreen} />
            <MainStack.Screen name="MainTabs" component={MainTabsNavigator} />
            <MainStack.Screen name="FitnessProfile" component={FitnessProfileScreen} />
            <MainStack.Screen name="ChatBot" component={ChatBotScreen} />
            <MainStack.Screen name="Notifications" component={NotificationScreen} />
        </MainStack.Navigator>
    );
}

export default function AppNavigator() {
    const isSignedIn = useSelector(state => state.auth.isSignedIn);

    // The conditional rendering is now at the top level
    return (
        <NavigationContainer>
            {isSignedIn ? <MainStackNavigator /> : <AuthStackNavigator />}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
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
});