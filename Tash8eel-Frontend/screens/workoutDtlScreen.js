// // // screens/WorkoutDetailScreen.js
// // import React from 'react';
// // import {
// //   View, Text, TouchableOpacity, StyleSheet, Dimensions
// // } from 'react-native';
// // import LottieView from 'lottie-react-native';
// // import { useDispatch, useSelector } from 'react-redux';

// // import { completeDay } from '../app/features/challengesSlice';

// // export default function WorkoutDetailScreen({ route }) {
// //   const { challengeId, day, workout } = route.params;
// //   const dispatch = useDispatch();
// //   const userId = useSelector(s => s.user.profile?._id);
// //   const completed = useSelector(s =>
// //     s.challenges.progress?.completedDays.includes(day)
// //   );

// //   const onMarkDone = () => {
// //     if (!completed) {
// //       dispatch(completeDay({ id: challengeId, userId, day }));
// //     }
// //   };

// //   const { width } = Dimensions.get('window');

// //   return (
// //     <View style={styles.container}>
// //       <LottieView
// //         source={{ uri: workout.animationUrl }}
// //         autoPlay
// //         loop
// //         style={{
// //           width: width * 0.8,
// //           height: width * 0.8
// //         }}
// //       />
// //       <Text style={styles.name}>{workout.name}</Text>
// //       <TouchableOpacity
// //         style={[styles.button, completed && styles.buttonDone]}
// //         onPress={onMarkDone}
// //       >
// //         <Text style={styles.buttonText}>
// //           {completed ? '✔️ Completed' : 'Mark Day as Done'}
// //         </Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16
// //   },
// //   name: { fontSize: 18, fontWeight: 'bold', marginVertical: 12 },
// //   button: {
// //     paddingHorizontal: 24,
// //     paddingVertical: 12,
// //     backgroundColor: '#4ADE80',
// //     borderRadius: 8
// //   },
// //   buttonDone: { backgroundColor: '#ccc' },
// //   buttonText: { color: '#fff', fontSize: 16 }
// // });



// // import React from 'react';
// // import {
// //   SafeAreaView,
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   StyleSheet,
// //   Dimensions
// // } from 'react-native';
// // import LottieView from 'lottie-react-native';
// // import { useDispatch, useSelector } from 'react-redux';

// // import { completeDay } from '../app/features/challengesSlice';

// // export default function WorkoutDetailScreen({ route }) {
// //   const { challengeId, day, workout } = route.params;
// //   const dispatch = useDispatch();
// //   const userId = useSelector(s => s.user.profile?._id);
// //   const completed = useSelector(s =>
// //     s.challenges.progress?.completedDays.includes(day)
// //   );
// //   const loading = useSelector(s => s.challenges.status === 'loading');

// //   const onMarkDone = () => {
// //     if (!completed) {
// //       dispatch(completeDay({ id: challengeId, userId, day }));
// //     }
// //   };

// //   const { width } = Dimensions.get('window');
// //   const size = width * 0.8;

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       {loading && (
// //         <ActivityIndicator
// //           style={StyleSheet.absoluteFill}
// //           size="large"
// //           color="#4ADE80"
// //         />
// //       )}
// //       <LottieView
// //         source={{ uri: workout.animationUrl }}
// //         autoPlay
// //         loop
// //         style={{ width: size, height: size }}
// //       />
// //       <Text style={styles.name}>{workout.name}</Text>
// //       <TouchableOpacity
// //         style={[styles.button, completed && styles.doneBtn]}
// //         onPress={onMarkDone}
// //         disabled={completed}
// //       >
// //         <Text style={styles.btnText}>
// //           {completed ? '✓ Completed' : 'Mark Day as Done'}
// //         </Text>
// //       </TouchableOpacity>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16
// //   },
// //   name: { fontSize: 18, fontWeight: '600', marginVertical: 16 },
// //   button: {
// //     backgroundColor: '#4ADE80',
// //     paddingVertical: 12,
// //     paddingHorizontal: 24,
// //     borderRadius: 8,
// //   },
// //   doneBtn: { backgroundColor: '#AAA' },
// //   btnText: { color: '#FFF', fontWeight: '600' }
// // });


// // screens/WorkoutDetailScreen.js
// // import React from 'react';
// // import {
// //   SafeAreaView,
// //   Text,
// //   StyleSheet,
// //   Dimensions
// // } from 'react-native';
// // import LottieView from 'lottie-react-native';

// // export default function WorkoutDetailScreen({ route }) {
// //   const { workout } = route.params;
// //   const { width } = Dimensions.get('window');
// //   const size = width * 0.8;

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <LottieView
// //         source={{ uri: workout.animationUrl }}
// //         autoPlay
// //         loop
// //         style={{ width: size, height: size }}
// //       />
// //       <Text style={styles.name}>{workout.name}</Text>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 16
// //   },
// //   name: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginVertical: 16
// //   }
// // });
// // screens/WorkoutDetailScreen.js
// import React from 'react';
// import { SafeAreaView, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
// import LottieView from 'lottie-react-native';
// import { colors } from '../theme/colors';
// import Header from '../components/Header';

// export default function WorkoutDetailScreen({ route }) {
//   const { workout } = route.params;
//   const { width } = Dimensions.get('window');
//   const size = width * 0.9;

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title={workout.name} />
//       <ScrollView contentContainerStyle={styles.content}>
//         <LottieView
//           source={{ uri: workout.animationUrl }}
//           autoPlay
//           loop
//           style={{ width: size, height: size, alignSelf: 'center' }}
//         />
//         {workout.tips && <Text style={styles.tip}>{workout.tips}</Text>}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.background },
//   content: { padding: 24 },
//   tip: {
//     marginTop: 16,
//     fontSize: 16,
//     color: colors.textSecondary,
//     textAlign: 'center',
//     fontStyle: 'italic'
//   }
// });
// screens/WorkoutDetailScreen.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../theme/colors';
import Header from '../components/Header';
import axios from 'axios';
import { API_BASE_URL_JO } from '../config';

export default function WorkoutDtlScreen({ route }) {
  const { workout: initialWorkout, workoutId } = route.params || {};
  const [workout, setWorkout] = useState(initialWorkout || null);
  const [loading, setLoading] = useState(!initialWorkout && !!workoutId);
  const { width } = Dimensions.get('window');
  const size = width * 0.9;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!workout && workoutId) {
        try {
          setLoading(true);
          const { data } = await axios.get(`${API_BASE_URL_JO}/api/workouts/${workoutId}`);
          if (mounted) setWorkout(data);
        } catch (e) {
          console.warn('Failed to fetch workout', e?.response?.data || e.message);
        } finally {
          if (mounted) setLoading(false);
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, [workout, workoutId]);

  if (loading || !workout) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Workout" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.accent} />
          {!loading && !workout && <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Workout not found.</Text>}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={workout.name || 'Workout'} />
      <ScrollView contentContainerStyle={styles.content}>
        {!!workout.animationUrl && (
          <LottieView
            source={{ uri: workout.animationUrl }}
            autoPlay
            loop
            style={{ width: size, height: size, alignSelf: 'center' }}
          />
        )}
        {workout.tips && <Text style={styles.tip}>{workout.tips}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24 },
  tip: {
    marginTop: 16, fontSize: 16, color: colors.textSecondary, textAlign: 'center', fontStyle: 'italic'
  }
});
