// // src/screens/HabitsStatsScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';

// const isoDay = (d = new Date()) => { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); };

// export default function HabitsStatsScreen() {
//   const token = useSelector(s => s.auth.token);
//   const api = axios.create({ baseURL: `${API_BASE_URL_JO}/api/habits`, headers: { Authorization: `Bearer ${token}` } });

//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({ days: [], goals: null, bestStreak: 0 });

//   useEffect(() => {
//     (async () => {
//       try {
//         const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 29);
//         const res = await api.get('/stats', { params: { from: isoDay(from), to: isoDay(to) } });
//         setStats(res.data);
//       } finally { setLoading(false); }
//     })();
//   }, []);

//   if (loading) {
//     return (<SafeAreaView style={styles.container}><Header title="Statistics" /><ActivityIndicator color="#5856D6" style={{ marginTop: 24 }} /></SafeAreaView>);
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Statistics" />
//       <View style={styles.summary}>
//         <Text style={styles.summaryTxt}>Best streak (all goals): {stats.bestStreak} days</Text>
//       </View>
//       <FlatList
//         data={stats.days.slice().reverse()} // latest first
//         keyExtractor={(_, i) => String(i)}
//         renderItem={({ item }) => (
//           <View style={styles.row}>
//             <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
//             <Text style={styles.value}>💧 {item.waterCount}/{stats.goals.waterTarget}</Text>
//             <Text style={styles.value}>🛌 {item.sleepHours}/{stats.goals.sleepTarget}h</Text>
//             <Text style={styles.value}>👟 {item.steps}/{stats.goals.stepsTarget}</Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#1C1C1E', paddingHorizontal:12 },
//   summary:{ backgroundColor:'#3A3A3C', padding:12, borderRadius:12, margin:12 },
//   summaryTxt:{ color:'#fff', fontWeight:'600' },
//   row:{ backgroundColor:'#2C2C2E', padding:12, borderRadius:12, marginHorizontal:12, marginBottom:10 },
//   date:{ color:'#fff', fontWeight:'700', marginBottom:6 },
//   value:{ color:'#B0B0B0' },
// });
















// // screens/HabitsStatsScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';

// const isoDay = (d = new Date()) => { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); };

// export default function HabitsStatsScreen() {
//   const token = useSelector(s => s.auth.token);
//   const api = axios.create({ baseURL: `${API_BASE_URL_JO}/api/habits`, headers: { Authorization: `Bearer ${token}` } });

//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({ entries: [], streak:{best:0,current:0}, totals:{} , range:{} , completionRate:{} , goals: null });

//   useEffect(() => {
//     (async () => {
//       try {
//         const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 29);
//         const res = await api.get('/stats', { params: { from: isoDay(from), to: isoDay(to) } });
//         setStats(res.data);
//       } finally { setLoading(false); }
//     })();
//   }, []);

//   if (loading) {
//     return (<SafeAreaView style={styles.container}><Header title="Statistics" /><ActivityIndicator color="#5856D6" style={{ marginTop: 24 }} /></SafeAreaView>);
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Statistics" />
//       <View style={styles.summary}>
//         <Text style={styles.summaryTxt}>Best streak (all goals): {stats?.streak?.best || 0} days</Text>
//       </View>
//       <FlatList
//         data={(stats.entries || []).slice().reverse()}
//         keyExtractor={(_, i) => String(i)}
//         renderItem={({ item }) => (
//           <View style={styles.row}>
//             <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
//             <Text style={styles.value}>💧 {item.water}/{(stats.goals?.waterGoal ?? 10)}</Text>
//             <Text style={styles.value}>🛌 {item.sleepHours}/{(stats.goals?.sleepGoalHours ?? 8)}h</Text>
//             <Text style={styles.value}>👟 {item.steps}/{(stats.goals?.stepsGoal ?? 10000)}</Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#1C1C1E', paddingHorizontal:12 },
//   summary:{ backgroundColor:'#3A3A3C', padding:12, borderRadius:12, margin:12 },
//   summaryTxt:{ color:'#fff', fontWeight:'600' },
//   row:{ backgroundColor:'#2C2C2E', padding:12, borderRadius:12, marginHorizontal:12, marginBottom:10 },
//   date:{ color:'#fff', fontWeight:'700', marginBottom:6 },
//   value:{ color:'#B0B0B0' },
// });
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, Alert } from 'react-native';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';

// const isoDay = (d = new Date()) => { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); };

// export default function HabitsStatsScreen() {
//   const token = useSelector(s => s.auth.token);
//   const api = axios.create({ baseURL: `${API_BASE_URL_JO}/api/habits`, headers: { Authorization: `Bearer ${token}` } });

//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({ days: [], goals: null, streak: {best:0,current:0} });

//   useEffect(() => {
//     (async () => {
//       try {
//         const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 29);
//         const res = await api.get('/stats', { params: { from: isoDay(from), to: isoDay(to) } });
//         setStats(res.data);
//       } catch (e) {
//         Alert.alert('Error', 'Failed to load statistics');
//       } finally { setLoading(false); }
//     })();
//   }, []);

//   if (loading) {
//     return (<SafeAreaView style={styles.container}><Header title="Statistics" /><ActivityIndicator color="#5856D6" style={{ marginTop: 24 }} /></SafeAreaView>);
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Statistics" />
//       <View style={styles.summary}>
//         <Text style={styles.summaryTxt}>Best streak (all goals): {stats.streak?.best ?? 0} days</Text>
//       </View>
//       <FlatList
//         data={(stats.days || []).slice().reverse()}
//         keyExtractor={(_, i) => String(i)}
//         renderItem={({ item }) => (
//           <View style={styles.row}>
//             <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
//             <Text style={styles.value}>💧 {item.waterCount}/{stats.goals.waterTarget}</Text>
//             <Text style={styles.value}>🛌 {item.sleepHours}/{stats.goals.sleepTarget}h</Text>
//             <Text style={styles.value}>👟 {item.steps}/{stats.goals.stepsTarget}</Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#1C1C1E', paddingHorizontal:12 },
//   summary:{ backgroundColor:'#3A3A3C', padding:12, borderRadius:12, margin:12 },
//   summaryTxt:{ color:'#fff', fontWeight:'600' },
//   row:{ backgroundColor:'#2C2C2E', padding:12, borderRadius:12, marginHorizontal:12, marginBottom:10 },
//   date:{ color:'#fff', fontWeight:'700', marginBottom:6 },
//   value:{ color:'#B0B0B0' },
// });


import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL_JO } from '../config';
import Header from '../components/Header';

const isoDay = (d = new Date()) => { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); };

export default function HabitsStatsScreen() {
  const token = useSelector(s => s.auth.token);
  const api = useMemo(() => token ? axios.create({
    baseURL: `${API_BASE_URL_JO}/api/habits`,
    headers: { Authorization: `Bearer ${token}` }
  }) : null, [token]);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ days: [], goals: null, streak: {best:0,current:0} });

  useEffect(() => {
    if (!api) return;
    (async () => {
      try {
        const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 29);
        const res = await api.get('/stats', { params: { from: isoDay(from), to: isoDay(to) } });
        setStats(res.data);
      } catch (e) {
        Alert.alert('Error', e?.response?.data?.error || e.message || 'Failed to load statistics');
      } finally { setLoading(false); }
    })();
  }, [api]);

  if (!token) return <SafeAreaView style={styles.container}><Header title="Statistics" /><Text style={{color:'#fff', margin:16}}>You are not logged in.</Text></SafeAreaView>;
  if (loading) return (<SafeAreaView style={styles.container}><Header title="Statistics" /><ActivityIndicator color="#5856D6" style={{ marginTop: 24 }} /></SafeAreaView>);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Statistics" />
      <View style={styles.summary}>
        <Text style={styles.summaryTxt}>Best streak (all goals): {stats.streak?.best ?? 0} days</Text>
      </View>
      <FlatList
        data={(stats.days || []).slice().reverse()}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
            <Text style={styles.value}>💧 {item.waterCount}/{stats.goals.waterTarget}</Text>
            <Text style={styles.value}>🛌 {item.sleepHours}/{stats.goals.sleepTarget}h</Text>
            <Text style={styles.value}>👟 {item.steps}/{stats.goals.stepsTarget}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#1C1C1E', paddingHorizontal:12 },
  summary:{ backgroundColor:'#3A3A3C', padding:12, borderRadius:12, margin:12 },
  summaryTxt:{ color:'#fff', fontWeight:'600' },
  row:{ backgroundColor:'#2C2C2E', padding:12, borderRadius:12, marginHorizontal:12, marginBottom:10 },
  date:{ color:'#fff', fontWeight:'700', marginBottom:6 },
  value:{ color:'#B0B0B0' },
});
