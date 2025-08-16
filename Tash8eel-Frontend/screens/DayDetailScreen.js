// // screens/DayDetailScreen.js
// import React, { useEffect, useState } from 'react';
// import {
//   SafeAreaView,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
//   View,
// } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchChallengeDetail, completeDay } from '../app/features/challengesSlice';
// import { updateUserStreak } from '../app/features/userSlice';
// import { colors } from '../theme/colors';
// import Header from '../components/Header';
// import WorkoutCard from '../components/WorkoutCard';
// import CompletionModal from '../components/CompletionModal';
// import moment from 'moment';

// // NEW: Streak Celebration Component
// const StreakCelebration = ({ streak, isNewRecord, onClose }) => {
//   if (streak <= 1) return null;

//   return (
//     <View style={styles.streakCelebration}>
//       <Text style={styles.celebrationEmoji}>🔥</Text>
//       <Text style={styles.celebrationTitle}>
//         {isNewRecord ? 'New Record!' : 'Streak Updated!'}
//       </Text>
//       <Text style={styles.celebrationText}>
//         {streak} day{streak !== 1 ? 's' : ''} in a row!
//       </Text>
//       {isNewRecord && (
//         <Text style={styles.celebrationSubtext}>
//           🏆 Personal best!
//         </Text>
//       )}
//       <TouchableOpacity style={styles.celebrationButton} onPress={onClose}>
//         <Text style={styles.celebrationButtonText}>Keep Going!</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default function DayDetailScreen({ route, navigation }) {
//   const { challengeId, day } = route.params;
//   const dispatch = useDispatch();

//   const { detail, progress, status } = useSelector(s => s.challenges);
//   const loading = status === 'loading';
//   const userId = useSelector(s => s.user.profile?._id);
//   const token = useSelector(s => s.auth.token);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [streakCelebrationVisible, setStreakCelebrationVisible] = useState(false);
//   const [streakData, setStreakData] = useState({ current: 0, isNewRecord: false });
//   const [completingDay, setCompletingDay] = useState(false);

//   // Fetch (or re-fetch) the challenge detail
//   useEffect(() => {
//     if (!detail || detail._id !== challengeId) {
//       dispatch(fetchChallengeDetail({ id: challengeId, userId }));
//     }
//   }, [challengeId, detail, userId, dispatch]);

//   // When all days are complete, show completion modal
//   useEffect(() => {
//     if (
//       detail &&
//       progress &&
//       progress.completedDays.length === detail.durationDays
//     ) {
//       setModalVisible(true);
//     }
//   }, [detail, progress]);

//   const handleCompleteDay = async () => {
//     if (completingDay) return;

//     setCompletingDay(true);

//     try {
//       const result = await dispatch(completeDay({
//         id: challengeId,
//         day // Remove userId as it's now handled by auth middleware
//       })).unwrap();

//       // Show streak celebration if streak increased
//       if (result.streak && result.streak.current > 1) {
//         setStreakData({
//           current: result.streak.current,
//           isNewRecord: result.streak.isNewRecord
//         });
//         setStreakCelebrationVisible(true);
//       }

//       // Update user streak in Redux
//       dispatch(updateUserStreak({
//         token,
//         challengeCompleted: result.challengeCompleted
//       }));

//     } catch (error) {
//       console.error('Error completing day:', error);
//       Alert.alert(
//         'Error',
//         'Failed to complete day. Please try again.',
//         [{ text: 'OK' }]
//       );
//     } finally {
//       setCompletingDay(false);
//     }
//   };

//   if (loading || !detail) {
//     return (
//       <SafeAreaView style={styles.center}>
//         <ActivityIndicator size="large" color={colors.accent} />
//       </SafeAreaView>
//     );
//   }

//   const workoutsForDay = detail.workouts
//     .filter(w => w.day === day)
//     .map(w => w.workoutId);
//   const completed = progress?.completedDays.includes(day);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title={`Day ${day}`} />

//       <FlatList
//         data={workoutsForDay}
//         keyExtractor={w => w._id}
//         numColumns={2}
//         renderItem={({ item }) => (
//           <WorkoutCard
//             workout={item}
//             onPress={() =>
//               navigation.navigate('WorkoutDtl', { workout: item })
//             }
//             theme="dark"
//           />
//         )}
//         contentContainerStyle={styles.list}
//       />

//       <TouchableOpacity
//         style={[
//           styles.completeButton,
//           completed && styles.completeButtonDone,
//           completingDay && styles.completeButtonLoading,
//         ]}
//         onPress={handleCompleteDay}
//         disabled={completed || completingDay}
//       >
//         {completingDay ? (
//           <ActivityIndicator color="#FFF" size="small" />
//         ) : (
//           <Text style={styles.completeText}>
//             {completed ? '✓ Day Complete' : 'Mark Day Complete'}
//           </Text>
//         )}
//       </TouchableOpacity>

//       {/* Completion Modal */}
//       <CompletionModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         challengeTitle={detail.title}
//         completionDate={moment().format('MMMM D, YYYY')}
//       />

//       {/* Streak Celebration Modal */}
//       {streakCelebrationVisible && (
//         <View style={styles.modalOverlay}>
//           <StreakCelebration
//             streak={streakData.current}
//             isNewRecord={streakData.isNewRecord}
//             onClose={() => setStreakCelebrationVisible(false)}
//           />
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.background },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.background,
//   },
//   list: { paddingHorizontal: 16, paddingTop: 16 },
//   completeButton: {
//     backgroundColor: colors.accent,
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     margin: 16,
//   },
//   completeButtonDone: {
//     backgroundColor: colors.border
//   },
//   completeButtonLoading: {
//     backgroundColor: colors.primary
//   },
//   completeText: {
//     color: '#FFF',
//     fontWeight: '600',
//     fontSize: 16
//   },
//   // NEW: Streak Celebration Styles
//   modalOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   streakCelebration: {
//     backgroundColor: colors.card,
//     borderRadius: 20,
//     padding: 30,
//     margin: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.5,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   celebrationEmoji: {
//     fontSize: 60,
//     marginBottom: 16,
//   },
//   celebrationTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: colors.text,
//     marginBottom: 8,
//   },
//   celebrationText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#FF6B35',
//     marginBottom: 8,
//   },
//   celebrationSubtext: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     marginBottom: 20,
//   },
//   celebrationButton: {
//     backgroundColor: colors.accent,
//     paddingHorizontal: 30,
//     paddingVertical: 12,
//     borderRadius: 25,
//   },
//   celebrationButtonText: {
//     color: '#FFF',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });
// screens/DayDetailScreen.js
import React, { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  View,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChallengeDetail, completeDay } from '../app/features/challengesSlice';
import { updateUserStreak } from '../app/features/userSlice';
import { colors } from '../theme/colors';
import Header from '../components/Header';
import WorkoutCard from '../components/WorkoutCard';
import CompletionModal from '../components/CompletionModal';
import moment from 'moment';

const StreakCelebration = ({ streak, isNewRecord, onClose }) => {
  if (streak <= 1) return null;
  return (
    <View style={styles.streakCelebration}>
      <Text style={styles.celebrationEmoji}>🔥</Text>
      <Text style={styles.celebrationTitle}>
        {isNewRecord ? 'New Record!' : 'Streak Updated!'}
      </Text>
      <Text style={styles.celebrationText}>
        {streak} day{streak !== 1 ? 's' : ''} in a row!
      </Text>
      {isNewRecord && <Text style={styles.celebrationSubtext}>🏆 Personal best!</Text>}
      <TouchableOpacity style={styles.celebrationButton} onPress={onClose}>
        <Text style={styles.celebrationButtonText}>Keep Going!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function DayDetailScreen({ route, navigation }) {
  const { challengeId, day } = route.params;
  const dispatch = useDispatch();

  const { detail, progress, status } = useSelector(s => s.challenges);
  const loading = status === 'loading';
  const userId = useSelector(s => s.user.profile?._id);
  const token = useSelector(s => s.auth.token);

  const [modalVisible, setModalVisible] = useState(false);
  const [streakCelebrationVisible, setStreakCelebrationVisible] = useState(false);
  const [streakData, setStreakData] = useState({ current: 0, isNewRecord: false });
  const [completingDay, setCompletingDay] = useState(false);

  useEffect(() => {
    if (!detail || detail._id !== challengeId) {
      dispatch(fetchChallengeDetail({ id: challengeId, userId }));
    }
  }, [challengeId, detail, userId, dispatch]);

  useEffect(() => {
    if (detail && progress && progress.completedDays.length === detail.durationDays) {
      setModalVisible(true);
    }
  }, [detail, progress]);

  // ✅ Robust list that tolerates string ObjectIds or populated objects
  const workoutsForDay = useMemo(() => {
    const lines = (detail?.workouts || []).filter(w => w && w.day === day && w.workoutId);
    return lines.map(w => w.workoutId).filter(Boolean); // values can be ObjectId strings OR populated objects
  }, [detail, day]);

  const completed = !!progress?.completedDays?.includes(day);

  const handleCompleteDay = async () => {
    if (completingDay) return;
    setCompletingDay(true);
    try {
      const result = await dispatch(completeDay({ id: challengeId, day })).unwrap();

      if (result.streak && result.streak.current > 1) {
        setStreakData({
          current: result.streak.current,
          isNewRecord: result.streak.isNewRecord
        });
        setStreakCelebrationVisible(true);
      }

      // Update user streak in Redux
      dispatch(updateUserStreak({ token, challengeCompleted: result.challengeCompleted }));
    } catch (error) {
      console.error('Error completing day:', error);
      Alert.alert('Error', 'Failed to complete day. Please try again.', [{ text: 'OK' }]);
    } finally {
      setCompletingDay(false);
    }
  };

  if (loading || !detail) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`Day ${day}`} />

      <FlatList
        data={workoutsForDay}
        numColumns={2}
        keyExtractor={(item, idx) => {
          // item can be an object or a string ObjectId
          if (item && typeof item === 'object' && item._id) return String(item._id);
          if (typeof item === 'string') return item;
          return String(idx);
        }}
        renderItem={({ item }) => {
          const workout = (item && typeof item === 'object') ? item : { _id: item };
          return (
            <WorkoutCard
              workout={workout}
              onPress={() =>
                navigation.navigate('WorkoutDtl', {
                  workoutId: typeof workout._id === 'string' ? workout._id : workout._id?.toString?.(),
                  workout: (workout.name ? workout : null) // pass full object if populated
                })
              }
              theme="dark"
            />
          );
        }}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={[
          styles.completeButton,
          completed && styles.completeButtonDone,
          completingDay && styles.completeButtonLoading,
        ]}
        onPress={handleCompleteDay}
        disabled={completed || completingDay}
      >
        {completingDay ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.completeText}>
            {completed ? '✓ Day Complete' : 'Mark Day Complete'}
          </Text>
        )}
      </TouchableOpacity>

      <CompletionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        completionDate={moment().format('MMMM D, YYYY')}
        challengeTitle={detail.title}
      />

      {streakCelebrationVisible && (
        <View style={styles.modalOverlay}>
          <StreakCelebration
            streak={streakData.current}
            isNewRecord={streakData.isNewRecord}
            onClose={() => setStreakCelebrationVisible(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  list: { paddingHorizontal: 16, paddingTop: 16 },
  completeButton: { backgroundColor: colors.accent, paddingVertical: 14, borderRadius: 8, alignItems: 'center', margin: 16 },
  completeButtonDone: { backgroundColor: colors.border },
  completeButtonLoading: { backgroundColor: colors.primary },
  completeText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  streakCelebration: {
    backgroundColor: colors.card, borderRadius: 20, padding: 30, margin: 20, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
  },
  celebrationEmoji: { fontSize: 60, marginBottom: 16 },
  celebrationTitle: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 8 },
  celebrationText: { fontSize: 18, fontWeight: '600', color: '#FF6B35', marginBottom: 8 },
  celebrationSubtext: { fontSize: 16, color: colors.textSecondary, marginBottom: 20 },
  celebrationButton: { backgroundColor: colors.accent, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  celebrationButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
});
