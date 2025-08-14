// import React, { useEffect } from 'react';
// import { SafeAreaView, FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { fetchChallenges } from '../app/features/challengesSlice';
// import { colors } from '../theme/colors';
// import Header from '../components/Header';

// export default function ChallengesListScreen({ navigation }) {
//   const dispatch = useDispatch();
//   // Get all challenges from the Redux store
//   const challenges = useSelector(s => s.challenges.list);

//   useEffect(() => {
//     dispatch(fetchChallenges());
//   }, []);

//   // NEW: Sort challenges alphabetically by title and then take the first 5
//   const sortedChallenges = [...challenges].sort((a, b) => {
//     return a.title.localeCompare(b.title);
//   }).slice(0, 5);

//   const renderItem = ({ item, index }) => (
//     <TouchableOpacity
//       style={styles.card}
//       activeOpacity={0.8}
//       onPress={() => navigation.navigate('ChallengeDetail', { id: item._id })}
//     >
      
//       <View style={styles.cardContent}>
//         <Text style={styles.cardTitle}>{item.title}</Text>
//         <View style={styles.cardMeta}>
//           <Ionicons name="calendar" size={16} color={colors.primary} />
//           <Text style={styles.cardMetaText}>{item.durationDays} days</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Challenges" />
//       <FlatList
//         // Use the new sorted and sliced challenges list
//         data={sortedChallenges}
//         renderItem={renderItem}
//         keyExtractor={item => item._id}
//         contentContainerStyle={styles.list}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.background },
//   list: { padding: 16 },
//   card: {
//     backgroundColor: colors.card,
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3
//   },
//   numberContainer: {
//     backgroundColor: colors.primary,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   numberText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   cardContent: { flex: 1 },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.text
//   },
//   cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
//   cardMetaText: { marginLeft: 6, color: colors.textSecondary }
// });


import React, { useEffect } from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchChallenges } from '../app/features/challengesSlice';
import { colors } from '../theme/colors';
import Header from '../components/Header';

export default function ChallengesListScreen({ navigation }) {
  const dispatch = useDispatch();
  const challenges = useSelector(s => s.challenges.list);

  useEffect(() => {
    dispatch(fetchChallenges());
  }, [dispatch]);

  const sortedChallenges = [...challenges].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ChallengeDetail', { id: item._id })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="calendar" size={16} color={colors.primary} />
          <Text style={styles.cardMetaText}>
            {item.durationDays} days
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Challenges" />
      <FlatList
        data={sortedChallenges}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  cardMetaText: { marginLeft: 6, color: colors.textSecondary },
});
