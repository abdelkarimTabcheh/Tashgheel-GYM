// // // src/screens/HabitsScreen.js
// // import React, { useEffect, useMemo, useRef, useState } from 'react';
// // import {
// //   View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert
// // } from 'react-native';
// // import axios from 'axios';
// // import { useSelector } from 'react-redux';
// // import useStepsToday from '../src/hooks/useStepsToday';
// // import { API_BASE_URL_JO } from '../config';
// // import Header from '../components/Header';

// // const isoDay = (d = new Date()) => {
// //   const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10);
// // };

// // export default function HabitsScreen({ navigation }) {
// //   const token = useSelector(s => s.auth.token);
// //   const todayKey = useMemo(() => isoDay(), []);
// //   const { steps, isAvailable } = useStepsToday(true);

// //   const [loading, setLoading] = useState(true);
// //   const [entry, setEntry] = useState({ waterCount: 0, sleepHours: 0, steps: 0 });
// //   const [goals, setGoals] = useState({ waterTarget: 10, sleepTarget: 8, stepsTarget: 10000 });
// //   const [done, setDone] = useState({ water: false, sleep: false, steps: false });

// //   const api = axios.create({
// //     baseURL: `${API_BASE_URL_JO}/api/habits`,
// //     headers: { Authorization: `Bearer ${token}` },
// //   });

// //   // pull summary for today
// //   useEffect(() => {
// //     let mounted = true;
// //     (async () => {
// //       try {
// //         setLoading(true);
// //         const res = await api.get('/summary', { params: { date: todayKey }});
// //         if (!mounted) return;
// //         setGoals(res.data.goals);
// //         setEntry(res.data.entry);
// //         setDone(res.data.done);
// //       } catch (e) {
// //         Alert.alert('Error', 'Failed to load habits');
// //       } finally {
// //         if (mounted) setLoading(false);
// //       }
// //     })();
// //     return () => { mounted = false; };
// //   }, [todayKey]);

// //   // push steps updates (debounced)
// //   const lastSentRef = useRef(0);
// //   useEffect(() => {
// //     if (isAvailable === false) return;
// //     const now = Date.now();
// //     if (Math.abs(steps - lastSentRef.current) < 50 && steps !== 0) return; // throttle noise
// //     const t = setTimeout(async () => {
// //       try {
// //         lastSentRef.current = steps;
// //         const res = await api.post('/entry', { date: todayKey, steps });
// //         setEntry(prev => ({ ...prev, steps: res.data.entry.steps }));
// //         setDone(res.data.done);
// //       } catch {}
// //     }, 1200);
// //     return () => clearTimeout(t);
// //   }, [steps]);

// //   const changeWater = async (delta) => {
// //     try {
// //       const res = await api.post('/entry', { date: todayKey, incWater: delta });
// //       setEntry(prev => ({ ...prev, waterCount: res.data.entry.waterCount }));
// //       setDone(res.data.done);
// //     } catch { Alert.alert('Error', 'Could not update water'); }
// //   };

// //   const changeSleep = async (delta) => {
// //     const newVal = Math.max(0, (entry.sleepHours || 0) + delta);
// //     try {
// //       const res = await api.post('/entry', { date: todayKey, sleepHours: newVal });
// //       setEntry(prev => ({ ...prev, sleepHours: res.data.entry.sleepHours }));
// //       setDone(res.data.done);
// //     } catch { Alert.alert('Error', 'Could not update sleep'); }
// //   };

// //   if (loading) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <Header title="Habits" />
// //         <View style={{ padding: 24 }}><ActivityIndicator color="#5856D6" /></View>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <Header title="Habits" />
// //       <View style={styles.card}>
// //         <Text style={styles.title}>Water</Text>
// //         <Text style={styles.subtitle}>{entry.waterCount} / {goals.waterTarget}</Text>
// //         <View style={styles.row}>
// //           <TouchableOpacity style={styles.btn} onPress={() => changeWater(-1)}><Text style={styles.btnTxt}>−</Text></TouchableOpacity>
// //           <TouchableOpacity style={styles.btn} onPress={() => changeWater(+1)}><Text style={styles.btnTxt}>＋</Text></TouchableOpacity>
// //           <View style={[styles.dot, done.water && styles.dotOn]} />
// //         </View>
// //       </View>

// //       <View style={styles.card}>
// //         <Text style={styles.title}>Sleep</Text>
// //         <Text style={styles.subtitle}>{entry.sleepHours} hours  (goal {goals.sleepTarget})</Text>
// //         <View style={styles.row}>
// //           <TouchableOpacity style={styles.btn} onPress={() => changeSleep(-1)}><Text style={styles.btnTxt}>−</Text></TouchableOpacity>
// //           <TouchableOpacity style={styles.btn} onPress={() => changeSleep(+1)}><Text style={styles.btnTxt}>＋</Text></TouchableOpacity>
// //           <View style={[styles.dot, done.sleep && styles.dotOn]} />
// //         </View>
// //       </View>

// //       <View style={styles.card}>
// //         <Text style={styles.title}>Steps</Text>
// //         <Text style={styles.subtitle}>
// //           {isAvailable === false ? 'Pedometer unavailable' : `${entry.steps} / ${goals.stepsTarget}`}
// //         </Text>
// //         <View style={styles.row}>
// //           <View style={[styles.dot, done.steps && styles.dotOn]} />
// //         </View>
// //       </View>

// //       <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('HabitsGoals')}>
// //         <Text style={styles.primaryTxt}>Change goals</Text>
// //       </TouchableOpacity>
// //       <TouchableOpacity style={[styles.primary, styles.secondary]} onPress={() => navigation.navigate('HabitsStats')}>
// //         <Text style={styles.primaryTxt}>View statistics</Text>
// //       </TouchableOpacity>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container:{ flex:1, backgroundColor:'#1C1C1E', paddingHorizontal:24 },
// //   card:{ backgroundColor:'#3A3A3C', borderRadius:16, padding:16, marginTop:16 },
// //   title:{ color:'#fff', fontSize:18, fontWeight:'700' },
// //   subtitle:{ color:'#B0B0B0', marginTop:4 },
// //   row:{ flexDirection:'row', alignItems:'center', marginTop:12 },
// //   btn:{ backgroundColor:'#2C2C2E', paddingHorizontal:16, paddingVertical:8, borderRadius:12, marginRight:10, borderWidth:1, borderColor:'#555' },
// //   btnTxt:{ color:'#fff', fontSize:18, fontWeight:'700' },
// //   dot:{ width:22, height:22, borderRadius:11, backgroundColor:'#555' },
// //   dotOn:{ backgroundColor:'#4ADE80' },
// //   primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginTop:16 },
// //   secondary:{ backgroundColor:'#4543b6' },
// //   primaryTxt:{ color:'#fff', fontWeight:'700' },
// // });

// // src/screens/HabitsScreen.js
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import useStepsToday from '../src/hooks/useStepsToday';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const isoDay = (d = new Date()) => { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); };

// const ProgressBar = ({ value = 0, target = 1 }) => {
//   const pct = Math.max(0, Math.min(1, target ? value / target : 0));
//   return (
//     <View style={styles.progress}>
//       <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
//     </View>
//   );
// };

// const StatPill = ({ icon, label }) => (
//   <View style={styles.statPill}>
//     <Text style={styles.statIcon}>{icon}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </View>
// );

// export default function HabitsScreen({ navigation }) {
//   const token = useSelector(s => s.auth.token);
//   const todayKey = useMemo(() => isoDay(), []);
//   const { steps, isAvailable, recheck } = useStepsToday(true);

//   const [loading, setLoading] = useState(true);
//   const [entry, setEntry] = useState({ waterCount: 0, sleepHours: 0, steps: 0 });
//   const [goals, setGoals] = useState({ waterTarget: 10, sleepTarget: 8, stepsTarget: 10000 });
//   const [done, setDone] = useState({ water: false, sleep: false, steps: false });

//   const api = axios.create({
//     baseURL: `${API_BASE_URL_JO}/api/habits`,
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   // initial load
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await api.get('/summary', { params: { date: todayKey } });
//         if (!mounted) return;
//         setGoals(res.data.goals);
//         setEntry(res.data.entry);
//         setDone(res.data.done);
//       } catch (e) {
//         Alert.alert('Error', 'Failed to load habits');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, [todayKey]);

//   // push steps changes to backend (debounced/throttled)
//   const lastSentRef = useRef(0);
//   useEffect(() => {
//     // if Google Fit/Health not available, skip
//     if (isAvailable === false) return;

//     const now = Date.now();
//     if (Math.abs(steps - lastSentRef.current) < 50 && steps !== 0) return; // throttle noise
//     const t = setTimeout(async () => {
//       try {
//         lastSentRef.current = steps;
//         const res = await api.post('/entry', { date: todayKey, steps });
//         setEntry(prev => ({ ...prev, steps: res.data.entry.steps }));
//         setDone(res.data.done);
//       } catch {}
//     }, 1200);
//     return () => clearTimeout(t);
//   }, [steps, isAvailable, todayKey]);

//   const changeWater = async (delta) => {
//     try {
//       const res = await api.post('/entry', { date: todayKey, incWater: delta });
//       setEntry(prev => ({ ...prev, waterCount: res.data.entry.waterCount }));
//       setDone(res.data.done);
//     } catch { Alert.alert('Error', 'Could not update water'); }
//   };

//   const changeSleep = async (delta) => {
//     const newVal = Math.max(0, (entry.sleepHours || 0) + delta);
//     try {
//       const res = await api.post('/entry', { date: todayKey, sleepHours: newVal });
//       setEntry(prev => ({ ...prev, sleepHours: res.data.entry.sleepHours }));
//       setDone(res.data.done);
//     } catch { Alert.alert('Error', 'Could not update sleep'); }
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Header title="Habits" />
//         <View style={{ padding: 24 }}><ActivityIndicator color="#5856D6" /></View>
//       </SafeAreaView>
//     );
//   }

//   const waterPct = Math.min(1, entry.waterCount / (goals.waterTarget || 1));
//   const sleepPct = Math.min(1, entry.sleepHours / (goals.sleepTarget || 1));
//   const stepsPct = Math.min(1, entry.steps / (goals.stepsTarget || 1));

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Habits" />

//       {/* Top summary card */}
//       <LinearGradient colors={['#6B73FF', '#000DFF']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
//         <View>
//           <Text style={styles.heroTitle}>Daily Progress</Text>
//           <Text style={styles.heroDate}>{new Date().toDateString()}</Text>
//         </View>
//         <View style={styles.pillsRow}>
//           <StatPill icon="💧" label={`${Math.round(waterPct*100)}% water`} />
//           <StatPill icon="🛌" label={`${Math.round(sleepPct*100)}% sleep`} />
//           <StatPill icon="👟" label={`${Math.round(stepsPct*100)}% steps`} />
//         </View>
//       </LinearGradient>

//       {/* WATER */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#0ea5e9' }]}><Ionicons name="water-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Water</Text>
//           <View style={[styles.badge, done.water && styles.badgeDone]}>
//             <Ionicons name={done.water ? 'checkmark' : 'ellipse-outline'} size={14} color={done.water ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>{entry.waterCount} / {goals.waterTarget} glasses</Text>
//         <ProgressBar value={entry.waterCount} target={goals.waterTarget} />
//         <View style={styles.actionsRow}>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeWater(-1)}>
//             <Ionicons name="remove" size={20} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeWater(+1)}>
//             <Ionicons name="add" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* SLEEP */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#a855f7' }]}><Ionicons name="moon-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Sleep</Text>
//           <View style={[styles.badge, done.sleep && styles.badgeDone]}>
//             <Ionicons name={done.sleep ? 'checkmark' : 'ellipse-outline'} size={14} color={done.sleep ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>{entry.sleepHours}h • goal {goals.sleepTarget}h</Text>
//         <ProgressBar value={entry.sleepHours} target={goals.sleepTarget} />
//         <View style={styles.actionsRow}>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeSleep(-1)}>
//             <Ionicons name="remove" size={20} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeSleep(+1)}>
//             <Ionicons name="add" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* STEPS */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#22c55e' }]}><Ionicons name="walk-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Steps</Text>
//           <View style={[styles.badge, done.steps && styles.badgeDone]}>
//             <Ionicons name={done.steps ? 'checkmark' : 'ellipse-outline'} size={14} color={done.steps ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>
//           {isAvailable === false ? 'Pedometer unavailable' : `${entry.steps} / ${goals.stepsTarget}`}
//         </Text>
//         <ProgressBar value={entry.steps} target={goals.stepsTarget} />

//         {isAvailable === false && (
//           <TouchableOpacity style={[styles.enableBtn]} onPress={recheck}>
//             <Ionicons name="shield-checkmark-outline" color="#fff" size={16} />
//             <Text style={styles.enableTxt}>Enable step tracking</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Bottom actions */}
//       <View style={{ height: 12 }} />
//       <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('HabitsGoals')}>
//         <Text style={styles.primaryTxt}>Change goals</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={[styles.primary, styles.secondary]} onPress={() => navigation.navigate('HabitsStats')}>
//         <Text style={styles.primaryTxt}>View statistics</Text>
//       </TouchableOpacity>
//       <View style={{ height: 16 }} />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#0B0B0F' },

//   hero:{ margin:16, borderRadius:16, padding:16 },
//   heroTitle:{ color:'#fff', fontSize:20, fontWeight:'800' },
//   heroDate:{ color:'#E5E7EB', marginTop:4 },
//   pillsRow:{ flexDirection:'row', marginTop:12 },
//   statPill:{ backgroundColor:'rgba(255,255,255,0.13)', borderRadius:999, paddingVertical:6, paddingHorizontal:12, marginRight:8, flexDirection:'row', alignItems:'center' },
//   statIcon:{ fontSize:14, marginRight:6 },
//   statLabel:{ color:'#fff', fontWeight:'600', fontSize:12 },

//   card:{ backgroundColor:'#141419', borderRadius:16, padding:16, marginHorizontal:16, marginTop:12, borderWidth:1, borderColor:'#1F2230' },
//   cardHeader:{ flexDirection:'row', alignItems:'center' },
//   iconWrap:{ width:32, height:32, borderRadius:8, alignItems:'center', justifyContent:'center', marginRight:10 },
//   cardTitle:{ color:'#fff', fontSize:16, fontWeight:'800', flex:1 },
//   badge:{ width:22, height:22, borderRadius:11, alignItems:'center', justifyContent:'center', backgroundColor:'#222' },
//   badgeDone:{ backgroundColor:'#113' },

//   cardMeta:{ color:'#9CA3AF', marginTop:8, marginBottom:10 },
//   progress:{ height:10, backgroundColor:'#1F2230', borderRadius:999, overflow:'hidden' },
//   progressFill:{ height:10, backgroundColor:'#5856D6' },

//   actionsRow:{ flexDirection:'row', marginTop:12 },
//   actionBtn:{ backgroundColor:'#222433', borderRadius:12, paddingVertical:10, paddingHorizontal:14, marginRight:10, borderWidth:1, borderColor:'#2B2E44' },

//   enableBtn:{ marginTop:12, backgroundColor:'#2c3e50', borderRadius:12, paddingVertical:10, paddingHorizontal:14, flexDirection:'row', alignItems:'center', alignSelf:'flex-start' },
//   enableTxt:{ color:'#fff', fontWeight:'700', marginLeft:8 },

//   primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginHorizontal:16 },
//   secondary:{ backgroundColor:'#4543b6', marginTop:10 },
//   primaryTxt:{ color:'#fff', fontWeight:'800' },
// });























// // screens/HabitsScreen.js
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import useStepsToday from '../src/hooks/useStepsToday'; // ⬅️ screens & hooks are siblings
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const isoDay = (d = new Date()) => { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); };

// const ProgressBar = ({ value = 0, target = 1 }) => {
//   const pct = Math.max(0, Math.min(1, target ? value / target : 0));
//   return (
//     <View style={styles.progress}>
//       <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
//     </View>
//   );
// };

// const StatPill = ({ icon, label }) => (
//   <View style={styles.statPill}>
//     <Text style={styles.statIcon}>{icon}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </View>
// );

// // normalize server shapes (old/new)
// const shapeGoals = (g = {}) => ({
//   waterTarget: g.waterTarget ?? g.waterGoal ?? 10,
//   sleepTarget: g.sleepTarget ?? g.sleepGoalHours ?? 8,
//   stepsTarget: g.stepsTarget ?? g.stepsGoal ?? 10000,
// });
// const shapeEntry = (e = {}) => ({
//   waterCount: typeof e.waterCount === 'number' ? e.waterCount : (e.water ?? 0),
//   sleepHours: typeof e.sleepHours === 'number' ? e.sleepHours : 0,
//   steps: typeof e.steps === 'number' ? e.steps : 0,
// });
// const shapeDone = (obj = {}) => obj.done ?? obj.completed ?? { water:false, sleep:false, steps:false };

// export default function HabitsScreen({ navigation }) {
//   const token = useSelector(s => s.auth.token);
//   const todayKey = useMemo(() => isoDay(), []);
//   const { steps, isAvailable, recheck } = useStepsToday(true);

//   const [loading, setLoading] = useState(true);
//   const [entry, setEntry] = useState({ waterCount: 0, sleepHours: 0, steps: 0 });
//   const [goals, setGoals] = useState({ waterTarget: 10, sleepTarget: 8, stepsTarget: 10000 });
//   const [done, setDone] = useState({ water: false, sleep: false, steps: false });

//   const api = axios.create({
//     baseURL: `${API_BASE_URL_JO}/api/habits`,
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   // initial load (tries /summary, falls back to /goals + /entry)
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         try {
//           const res = await api.get('/summary', { params: { date: todayKey } });
//           if (!mounted) return;
//           setGoals(shapeGoals(res.data?.goals));
//           setEntry(shapeEntry(res.data?.entry));
//           setDone(shapeDone(res.data));
//         } catch {
//           const [gRes, eRes] = await Promise.all([
//             api.get('/goals'),
//             api.get('/entry', { params: { date: todayKey } }),
//           ]);
//           if (!mounted) return;
//           setGoals(shapeGoals(gRes.data));
//           setEntry(shapeEntry(eRes.data));
//           setDone(shapeDone(eRes.data));
//         }
//       } catch {
//         Alert.alert('Error', 'Failed to load habits');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, [todayKey]);

//   // push steps changes (debounced)
//   const lastSentRef = useRef(0);
//   useEffect(() => {
//     if (isAvailable === false) return;
//     if (Math.abs(steps - lastSentRef.current) < 50 && steps !== 0) return; // avoid noise
//     const t = setTimeout(async () => {
//       try {
//         lastSentRef.current = steps;
//         const res = await api.post('/entry', { date: todayKey, steps });
//         const e = res.data?.entry || res.data || {};
//         setEntry(prev => ({ ...prev, steps: shapeEntry(e).steps }));
//         setDone(shapeDone(res.data));
//       } catch {}
//     }, 1000);
//     return () => clearTimeout(t);
//   }, [steps, isAvailable, todayKey]);

//   const changeWater = async (delta) => {
//     try {
//       const res = await api.post('/entry', { date: todayKey, incWater: delta });
//       const e = res.data?.entry || res.data || {};
//       setEntry(prev => ({ ...prev, waterCount: shapeEntry(e).waterCount }));
//       setDone(shapeDone(res.data));
//     } catch { Alert.alert('Error', 'Could not update water'); }
//   };

//   const changeSleep = async (delta) => {
//     const newVal = Math.max(0, (entry.sleepHours || 0) + delta);
//     try {
//       const res = await api.post('/entry', { date: todayKey, sleepHours: newVal });
//       const e = res.data?.entry || res.data || {};
//       setEntry(prev => ({ ...prev, sleepHours: shapeEntry(e).sleepHours }));
//       setDone(shapeDone(res.data));
//     } catch { Alert.alert('Error', 'Could not update sleep'); }
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Header title="Habits" />
//         <View style={{ padding: 24 }}><ActivityIndicator color="#5856D6" /></View>
//       </SafeAreaView>
//     );
//   }

//   const waterPct = Math.min(1, entry.waterCount / (goals.waterTarget || 1));
//   const sleepPct = Math.min(1, entry.sleepHours / (goals.sleepTarget || 1));
//   const stepsPct = Math.min(1, entry.steps / (goals.stepsTarget || 1));

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Habits" />
//       <LinearGradient colors={['#6B73FF', '#000DFF']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
//         <View>
//           <Text style={styles.heroTitle}>Daily Progress</Text>
//           <Text style={styles.heroDate}>{new Date().toDateString()}</Text>
//         </View>
//         <View style={styles.pillsRow}>
//           <StatPill icon="💧" label={`${Math.round(waterPct*100)}% water`} />
//           <StatPill icon="🛌" label={`${Math.round(sleepPct*100)}% sleep`} />
//           <StatPill icon="👟" label={`${Math.round(stepsPct*100)}% steps`} />
//         </View>
//       </LinearGradient>

//       {/* WATER */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#0ea5e9' }]}><Ionicons name="water-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Water</Text>
//           <View style={[styles.badge, done.water && styles.badgeDone]}>
//             <Ionicons name={done.water ? 'checkmark' : 'ellipse-outline'} size={14} color={done.water ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>{entry.waterCount} / {goals.waterTarget} glasses</Text>
//         <ProgressBar value={entry.waterCount} target={goals.waterTarget} />
//         <View style={styles.actionsRow}>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeWater(-1)}>
//             <Ionicons name="remove" size={20} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeWater(+1)}>
//             <Ionicons name="add" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* SLEEP */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#a855f7' }]}><Ionicons name="moon-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Sleep</Text>
//           <View style={[styles.badge, done.sleep && styles.badgeDone]}>
//             <Ionicons name={done.sleep ? 'checkmark' : 'ellipse-outline'} size={14} color={done.sleep ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>{entry.sleepHours}h • goal {goals.sleepTarget}h</Text>
//         <ProgressBar value={entry.sleepHours} target={goals.sleepTarget} />
//         <View style={styles.actionsRow}>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeSleep(-1)}>
//             <Ionicons name="remove" size={20} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeSleep(+1)}>
//             <Ionicons name="add" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* STEPS */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#22c55e' }]}><Ionicons name="walk-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Steps</Text>
//           <View style={[styles.badge, done.steps && styles.badgeDone]}>
//             <Ionicons name={done.steps ? 'checkmark' : 'ellipse-outline'} size={14} color={done.steps ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>
//           {isAvailable === false ? 'Pedometer unavailable' : `${entry.steps} / ${goals.stepsTarget}`}
//         </Text>
//         <ProgressBar value={entry.steps} target={goals.stepsTarget} />
//         {isAvailable === false && (
//           <TouchableOpacity style={[styles.enableBtn]} onPress={recheck}>
//             <Ionicons name="shield-checkmark-outline" color="#fff" size={16} />
//             <Text style={styles.enableTxt}>Enable step tracking</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <View style={{ height: 12 }} />
//       <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('HabitsGoals')}>
//         <Text style={styles.primaryTxt}>Change goals</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={[styles.primary, styles.secondary]} onPress={() => navigation.navigate('HabitsStats')}>
//         <Text style={styles.primaryTxt}>View statistics</Text>
//       </TouchableOpacity>
//       <View style={{ height: 16 }} />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#0B0B0F' },

//   hero:{ margin:16, borderRadius:16, padding:16 },
//   heroTitle:{ color:'#fff', fontSize:20, fontWeight:'800' },
//   heroDate:{ color:'#E5E7EB', marginTop:4 },
//   pillsRow:{ flexDirection:'row', marginTop:12 },
//   statPill:{ backgroundColor:'rgba(255,255,255,0.13)', borderRadius:999, paddingVertical:6, paddingHorizontal:12, marginRight:8, flexDirection:'row', alignItems:'center' },
//   statIcon:{ fontSize:14, marginRight:6 },
//   statLabel:{ color:'#fff', fontWeight:'600', fontSize:12 },

//   card:{ backgroundColor:'#141419', borderRadius:16, padding:16, marginHorizontal:16, marginTop:12, borderWidth:1, borderColor:'#1F2230' },
//   cardHeader:{ flexDirection:'row', alignItems:'center' },
//   iconWrap:{ width:32, height:32, borderRadius:8, alignItems:'center', justifyContent:'center', marginRight:10 },
//   cardTitle:{ color:'#fff', fontSize:16, fontWeight:'800', flex:1 },
//   badge:{ width:22, height:22, borderRadius:11, alignItems:'center', justifyContent:'center', backgroundColor:'#222' },
//   badgeDone:{ backgroundColor:'#113' },

//   cardMeta:{ color:'#9CA3AF', marginTop:8, marginBottom:10 },
//   progress:{ height:10, backgroundColor:'#1F2230', borderRadius:999, overflow:'hidden' },
//   progressFill:{ height:10, backgroundColor:'#5856D6' },

//   actionsRow:{ flexDirection:'row', marginTop:12 },
//   actionBtn:{ backgroundColor:'#222433', borderRadius:12, paddingVertical:10, paddingHorizontal:14, marginRight:10, borderWidth:1, borderColor:'#2B2E44' },

//   enableBtn:{ marginTop:12, backgroundColor:'#2c3e50', borderRadius:12, paddingVertical:10, paddingHorizontal:14, flexDirection:'row', alignItems:'center', alignSelf:'flex-start' },
//   enableTxt:{ color:'#fff', fontWeight:'700', marginLeft:8 },

//   primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginHorizontal:16 },
//   secondary:{ backgroundColor:'#4543b6', marginTop:10 },
//   primaryTxt:{ color:'#fff', fontWeight:'800' },
// });











// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const isoDay = (d = new Date()) => { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); };

// const ProgressBar = ({ value = 0, target = 1 }) => {
//   const pct = Math.max(0, Math.min(1, target ? value / target : 0));
//   return (
//     <View style={styles.progress}>
//       <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
//     </View>
//   );
// };

// const StatPill = ({ icon, label }) => (
//   <View style={styles.statPill}>
//     <Text style={styles.statIcon}>{icon}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </View>
// );

// export default function HabitsScreen({ navigation }) {
//   const token = useSelector(s => s.auth.token);
//   const todayKey = useMemo(() => isoDay(), []);

//   const [loading, setLoading] = useState(true);
//   const [entry, setEntry] = useState({ waterCount: 0, sleepHours: 0, steps: 0 });
//   const [goals, setGoals] = useState({ waterTarget: 10, sleepTarget: 8, stepsTarget: 10000 });
//   const [done, setDone] = useState({ water: false, sleep: false, steps: false });

//   const api = axios.create({
//     baseURL: `${API_BASE_URL_JO}/api/habits`,
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   // initial load (summary)
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await api.get('/summary', { params: { date: todayKey } });
//         if (!mounted) return;
//         setGoals(res.data.goals);
//         setEntry(res.data.entry);
//         setDone(res.data.done);
//       } catch (e) {
//         Alert.alert('Error', 'Failed to load habits');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, [todayKey]);

//   const changeWater = async (delta) => {
//     try {
//       const res = await api.post('/entry', { date: todayKey, incWater: delta });
//       setEntry(prev => ({ ...prev, waterCount: res.data.waterCount }));
//       setDone(res.data.completed);
//     } catch {
//       Alert.alert('Error', 'Could not update water');
//     }
//   };

//   const changeSleep = async (delta) => {
//     const newVal = Math.max(0, (entry.sleepHours || 0) + delta);
//     try {
//       const res = await api.post('/entry', { date: todayKey, sleepHours: newVal });
//       setEntry(prev => ({ ...prev, sleepHours: res.data.sleepHours }));
//       setDone(res.data.completed);
//     } catch {
//       Alert.alert('Error', 'Could not update sleep');
//     }
//   };

//   const toggleStepsDone = async () => {
//     try {
//       const targetState = !done.steps;
//       const res = await api.post('/entry', { date: todayKey, stepsDone: targetState });
//       setEntry(prev => ({ ...prev, steps: res.data.steps }));
//       setDone(res.data.completed);
//     } catch {
//       Alert.alert('Error', 'Could not update steps');
//     }
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Header title="Habits" />
//         <View style={{ padding: 24 }}><ActivityIndicator color="#5856D6" /></View>
//       </SafeAreaView>
//     );
//   }

//   const waterPct = Math.min(1, entry.waterCount / (goals.waterTarget || 1));
//   const sleepPct = Math.min(1, entry.sleepHours / (goals.sleepTarget || 1));
//   const stepsPct = Math.min(1, entry.steps / (goals.stepsTarget || 1));

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Habits" />

//       {/* Top summary card */}
//       <LinearGradient colors={['#6B73FF', '#000DFF']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
//         <View>
//           <Text style={styles.heroTitle}>Daily Progress</Text>
//           <Text style={styles.heroDate}>{new Date().toDateString()}</Text>
//         </View>
//         <View style={styles.pillsRow}>
//           <StatPill icon="💧" label={`${Math.round(waterPct*100)}% water`} />
//           <StatPill icon="🛌" label={`${Math.round(sleepPct*100)}% sleep`} />
//           <StatPill icon="👟" label={`${Math.round(stepsPct*100)}% steps`} />
//         </View>
//       </LinearGradient>

//       {/* WATER */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#0ea5e9' }]}><Ionicons name="water-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Water</Text>
//           <View style={[styles.badge, done.water && styles.badgeDone]}>
//             <Ionicons name={done.water ? 'checkmark' : 'ellipse-outline'} size={14} color={done.water ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>{entry.waterCount} / {goals.waterTarget} glasses</Text>
//         <ProgressBar value={entry.waterCount} target={goals.waterTarget} />
//         <View style={styles.actionsRow}>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeWater(-1)}>
//             <Ionicons name="remove" size={20} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeWater(+1)}>
//             <Ionicons name="add" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* SLEEP */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#a855f7' }]}><Ionicons name="moon-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Sleep</Text>
//           <View style={[styles.badge, done.sleep && styles.badgeDone]}>
//             <Ionicons name={done.sleep ? 'checkmark' : 'ellipse-outline'} size={14} color={done.sleep ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>{entry.sleepHours}h • goal {goals.sleepTarget}h</Text>
//         <ProgressBar value={entry.sleepHours} target={goals.sleepTarget} />
//         <View style={styles.actionsRow}>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeSleep(-1)}>
//             <Ionicons name="remove" size={20} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => changeSleep(+1)}>
//             <Ionicons name="add" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* STEPS (manual mark done / undo) */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#22c55e' }]}><Ionicons name="walk-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Steps</Text>
//           <View style={[styles.badge, done.steps && styles.badgeDone]}>
//             <Ionicons name={done.steps ? 'checkmark' : 'ellipse-outline'} size={14} color={done.steps ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>
//           {done.steps ? `Done (${entry.steps}/${goals.stepsTarget})` : `Not done (${entry.steps}/${goals.stepsTarget})`}
//         </Text>
//         <ProgressBar value={entry.steps} target={goals.stepsTarget} />
//         <View style={styles.actionsRow}>
//           <TouchableOpacity
//             style={[styles.markBtn, done.steps ? styles.markBtnOn : styles.markBtnOff]}
//             onPress={toggleStepsDone}
//             activeOpacity={0.85}
//           >
//             <Ionicons name={done.steps ? 'checkmark-circle' : 'ellipse-outline'} size={18} color="#fff" />
//             <Text style={styles.markTxt}>{done.steps ? 'Completed — tap to undo' : 'Mark steps as done'}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Bottom actions */}
//       <View style={{ height: 12 }} />
//       <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('HabitsGoals')}>
//         <Text style={styles.primaryTxt}>Change goals</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={[styles.primary, styles.secondary]} onPress={() => navigation.navigate('HabitsStats')}>
//         <Text style={styles.primaryTxt}>View statistics</Text>
//       </TouchableOpacity>
//       <View style={{ height: 16 }} />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#0B0B0F' },

//   hero:{ margin:16, borderRadius:16, padding:16 },
//   heroTitle:{ color:'#fff', fontSize:20, fontWeight:'800' },
//   heroDate:{ color:'#E5E7EB', marginTop:4 },
//   pillsRow:{ flexDirection:'row', marginTop:12 },
//   statPill:{ backgroundColor:'rgba(255,255,255,0.13)', borderRadius:999, paddingVertical:6, paddingHorizontal:12, marginRight:8, flexDirection:'row', alignItems:'center' },
//   statIcon:{ fontSize:14, marginRight:6 },
//   statLabel:{ color:'#fff', fontWeight:'600', fontSize:12 },

//   card:{ backgroundColor:'#141419', borderRadius:16, padding:16, marginHorizontal:16, marginTop:12, borderWidth:1, borderColor:'#1F2230' },
//   cardHeader:{ flexDirection:'row', alignItems:'center' },
//   iconWrap:{ width:32, height:32, borderRadius:8, alignItems:'center', justifyContent:'center', marginRight:10 },
//   cardTitle:{ color:'#fff', fontSize:16, fontWeight:'800', flex:1 },
//   badge:{ width:22, height:22, borderRadius:11, alignItems:'center', justifyContent:'center', backgroundColor:'#222' },
//   badgeDone:{ backgroundColor:'#113' },

//   cardMeta:{ color:'#9CA3AF', marginTop:8, marginBottom:10 },
//   progress:{ height:10, backgroundColor:'#1F2230', borderRadius:999, overflow:'hidden' },
//   progressFill:{ height:10, backgroundColor:'#5856D6' },

//   actionsRow:{ flexDirection:'row', marginTop:12 },
//   actionBtn:{ backgroundColor:'#222433', borderRadius:12, paddingVertical:10, paddingHorizontal:14, marginRight:10, borderWidth:1, borderColor:'#2B2E44' },

//   markBtn:{ flexDirection:'row', alignItems:'center', borderRadius:12, paddingVertical:12, paddingHorizontal:14 },
//   markBtnOn:{ backgroundColor:'#2563eb', borderWidth:1, borderColor:'#3b82f6' },
//   markBtnOff:{ backgroundColor:'#374151', borderWidth:1, borderColor:'#4b5563' },
//   markTxt:{ color:'#fff', fontWeight:'700', marginLeft:8 },

//   primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginHorizontal:16 },
//   secondary:{ backgroundColor:'#4543b6', marginTop:10 },
//   primaryTxt:{ color:'#fff', fontWeight:'800' },
// });






























// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const isoDay = (d = new Date()) => { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); };

// const ProgressBar = ({ value = 0, target = 1 }) => {
//   const pct = Math.max(0, Math.min(1, target ? value / target : 0));
//   return (
//     <View style={styles.progress}>
//       <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
//     </View>
//   );
// };

// const StatPill = ({ icon, label }) => (
//   <View style={styles.statPill}>
//     <Text style={styles.statIcon}>{icon}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </View>
// );

// export default function HabitsScreen({ navigation }) {
//   const token = useSelector(s => s.auth.token);
//   const [loading, setLoading] = useState(true);
//   const [busy, setBusy] = useState(false);

//   const [entry, setEntry] = useState({ waterCount: 0, sleepHours: 0, steps: 0 });
//   const [goals, setGoals] = useState({ waterTarget: 10, sleepTarget: 8, stepsTarget: 10000 });
//   const [done, setDone]   = useState({ water: false, sleep: false, steps: false });

//   const todayKey = useMemo(() => isoDay(), []);
//   const api = useMemo(() => {
//     if (!token) return null;
//     return axios.create({
//       baseURL: `${API_BASE_URL_JO}/api/habits`,
//       headers: { Authorization: `Bearer ${token}` }
//     });
//   }, [token]);

//   // helper: show server error message
//   const showErr = (fallback, e) => {
//     const msg = e?.response?.data?.error || e?.message || fallback;
//     Alert.alert('Error', msg);
//   };

//   useEffect(() => {
//     if (!api) return; // wait until token exists
//     let mounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await api.get('/summary', { params: { date: todayKey } });
//         if (!mounted) return;
//         setGoals(res.data.goals);
//         setEntry(res.data.entry);
//         setDone(res.data.done);
//       } catch (e) {
//         showErr('Failed to load habits', e);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, [api, todayKey]);

//   const changeWater = async (delta) => {
//     if (!api || busy) return;
//     try {
//       setBusy(true);
//       const res = await api.post('/entry', { date: todayKey, incWater: delta });
//       setEntry(prev => ({ ...prev, waterCount: res.data.waterCount }));
//       setDone(res.data.completed);
//     } catch (e) {
//       showErr('Could not update water', e);
//     } finally {
//       setBusy(false);
//     }
//   };

//   const changeSleep = async (delta) => {
//     if (!api || busy) return;
//     try {
//       setBusy(true);
//       const newVal = Math.max(0, (entry.sleepHours || 0) + delta);
//       const res = await api.post('/entry', { date: todayKey, sleepHours: newVal });
//       setEntry(prev => ({ ...prev, sleepHours: res.data.sleepHours }));
//       setDone(res.data.completed);
//     } catch (e) {
//       showErr('Could not update sleep', e);
//     } finally {
//       setBusy(false);
//     }
//   };

//   const toggleStepsDone = async () => {
//     if (!api || busy) return;
//     try {
//       setBusy(true);
//       const res = await api.post('/entry', { date: todayKey, stepsDone: !done.steps });
//       setEntry(prev => ({ ...prev, steps: res.data.steps }));
//       setDone(res.data.completed);
//     } catch (e) {
//       showErr('Could not update steps', e);
//     } finally {
//       setBusy(false);
//     }
//   };

//   if (!token) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Header title="Habits" />
//         <View style={{ padding: 24 }}>
//           <Text style={{ color: '#fff' }}>You are not logged in.</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Header title="Habits" />
//         <View style={{ padding: 24 }}><ActivityIndicator color="#5856D6" /></View>
//       </SafeAreaView>
//     );
//   }

//   const waterPct = Math.min(1, (entry.waterCount || 0) / (goals.waterTarget || 1));
//   const sleepPct = Math.min(1, (entry.sleepHours || 0) / (goals.sleepTarget || 1));
//   const stepsPct = Math.min(1, (entry.steps || 0) / (goals.stepsTarget || 1));

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Habits" />

//       <LinearGradient colors={['#6B73FF', '#000DFF']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
//         <View>
//           <Text style={styles.heroTitle}>Daily Progress</Text>
//           <Text style={styles.heroDate}>{new Date().toDateString()}</Text>
//         </View>
//         <View style={styles.pillsRow}>
//           <StatPill icon="💧" label={`${Math.round(waterPct*100)}% water`} />
//           <StatPill icon="🛌" label={`${Math.round(sleepPct*100)}% sleep`} />
//           <StatPill icon="👟" label={`${Math.round(stepsPct*100)}% steps`} />
//         </View>
//       </LinearGradient>

//       {/* WATER */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#0ea5e9' }]}><Ionicons name="water-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Water</Text>
//           <View style={[styles.badge, done.water && styles.badgeDone]}>
//             <Ionicons name={done.water ? 'checkmark' : 'ellipse-outline'} size={14} color={done.water ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>{entry.waterCount} / {goals.waterTarget} glasses</Text>
//         <ProgressBar value={entry.waterCount} target={goals.waterTarget} />
//         <View style={styles.actionsRow}>
//           <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeWater(-1)}>
//             <Ionicons name="remove" size={20} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeWater(+1)}>
//             <Ionicons name="add" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* SLEEP */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#a855f7' }]}><Ionicons name="moon-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Sleep</Text>
//           <View style={[styles.badge, done.sleep && styles.badgeDone]}>
//             <Ionicons name={done.sleep ? 'checkmark' : 'ellipse-outline'} size={14} color={done.sleep ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>{entry.sleepHours}h • goal {goals.sleepTarget}h</Text>
//         <ProgressBar value={entry.sleepHours} target={goals.sleepTarget} />
//         <View style={styles.actionsRow}>
//           <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeSleep(-1)}>
//             <Ionicons name="remove" size={20} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeSleep(+1)}>
//             <Ionicons name="add" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* STEPS */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={[styles.iconWrap, { backgroundColor: '#22c55e' }]}><Ionicons name="walk-outline" color="#fff" size={20}/></View>
//           <Text style={styles.cardTitle}>Steps</Text>
//           <View style={[styles.badge, done.steps && styles.badgeDone]}>
//             <Ionicons name={done.steps ? 'checkmark' : 'ellipse-outline'} size={14} color={done.steps ? '#0f0' : '#999'} />
//           </View>
//         </View>
//         <Text style={styles.cardMeta}>
//           {done.steps ? `Done (${entry.steps}/${goals.stepsTarget})` : `Not done (${entry.steps}/${goals.stepsTarget})`}
//         </Text>
//         <ProgressBar value={entry.steps} target={goals.stepsTarget} />
//         <View style={styles.actionsRow}>
//           <TouchableOpacity
//             disabled={busy}
//             style={[styles.markBtn, done.steps ? styles.markBtnOn : styles.markBtnOff, busy && styles.disabled]}
//             onPress={toggleStepsDone}
//             activeOpacity={0.85}
//           >
//             <Ionicons name={done.steps ? 'checkmark-circle' : 'ellipse-outline'} size={18} color="#fff" />
//             <Text style={styles.markTxt}>{done.steps ? 'Completed — tap to undo' : 'Mark steps as done'}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Bottom actions */}
//       <View style={{ height: 12 }} />
//       <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('HabitsGoals')}>
//         <Text style={styles.primaryTxt}>Change goals</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={[styles.primary, styles.secondary]} onPress={() => navigation.navigate('HabitsStats')}>
//         <Text style={styles.primaryTxt}>View statistics</Text>
//       </TouchableOpacity>
//       <View style={{ height: 16 }} />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#0B0B0F' },

//   hero:{ margin:16, borderRadius:16, padding:16 },
//   heroTitle:{ color:'#fff', fontSize:20, fontWeight:'800' },
//   heroDate:{ color:'#E5E7EB', marginTop:4 },
//   pillsRow:{ flexDirection:'row', marginTop:12 },
//   statPill:{ backgroundColor:'rgba(255,255,255,0.13)', borderRadius:999, paddingVertical:6, paddingHorizontal:12, marginRight:8, flexDirection:'row', alignItems:'center' },
//   statIcon:{ fontSize:14, marginRight:6 },
//   statLabel:{ color:'#fff', fontWeight:'600', fontSize:12 },

//   card:{ backgroundColor:'#141419', borderRadius:16, padding:16, marginHorizontal:16, marginTop:12, borderWidth:1, borderColor:'#1F2230' },
//   cardHeader:{ flexDirection:'row', alignItems:'center' },
//   iconWrap:{ width:32, height:32, borderRadius:8, alignItems:'center', justifyContent:'center', marginRight:10 },
//   cardTitle:{ color:'#fff', fontSize:16, fontWeight:'800', flex:1 },
//   badge:{ width:22, height:22, borderRadius:11, alignItems:'center', justifyContent:'center', backgroundColor:'#222' },
//   badgeDone:{ backgroundColor:'#113' },

//   cardMeta:{ color:'#9CA3AF', marginTop:8, marginBottom:10 },
//   progress:{ height:10, backgroundColor:'#1F2230', borderRadius:999, overflow:'hidden' },
//   progressFill:{ height:10, backgroundColor:'#5856D6' },

//   actionsRow:{ flexDirection:'row', marginTop:12 },
//   actionBtn:{ backgroundColor:'#222433', borderRadius:12, paddingVertical:10, paddingHorizontal:14, marginRight:10, borderWidth:1, borderColor:'#2B2E44' },

//   markBtn:{ flexDirection:'row', alignItems:'center', borderRadius:12, paddingVertical:12, paddingHorizontal:14 },
//   markBtnOn:{ backgroundColor:'#2563eb', borderWidth:1, borderColor:'#3b82f6' },
//   markBtnOff:{ backgroundColor:'#374151', borderWidth:1, borderColor:'#4b5563' },
//   markTxt:{ color:'#fff', fontWeight:'700', marginLeft:8 },

//   primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginHorizontal:16 },
//   secondary:{ backgroundColor:'#4543b6', marginTop:10 },
//   primaryTxt:{ color:'#fff', fontWeight:'800' },

//   disabled:{ opacity:0.5 }
// });
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL_JO } from '../config';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

const isoDay = (d = new Date()) => { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); };

const ProgressBar = ({ value = 0, target = 1 }) => {
  const pct = Math.max(0, Math.min(1, target ? value / target : 0));
  return <View style={styles.progress}><View style={[styles.progressFill, { width: `${pct * 100}%` }]} /></View>;
};

const StatPill = ({ icon, label }) => (
  <View style={styles.statPill}><Text style={styles.statIcon}>{icon}</Text><Text style={styles.statLabel}>{label}</Text></View>
);

export default function HabitsScreen({ navigation }) {
  const token = useSelector(s => s.auth.token);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [entry, setEntry] = useState({ waterCount: 0, sleepHours: 0, steps: 0 });
  const [goals, setGoals] = useState({ waterTarget: 10, sleepTarget: 8, stepsTarget: 10000 });
  const [done, setDone] = useState({ water: false, sleep: false, steps: false });

  const todayKey = useMemo(() => isoDay(), []);
  const api = useMemo(() => token ? axios.create({
    baseURL: `${API_BASE_URL_JO}/api/habits`,
    headers: { Authorization: `Bearer ${token}` }
  }) : null, [token]);

  const showErr = (fallback, e) => {
    const status = e?.response?.status;
    const base = e?.config?.baseURL || '';
    const url = e?.config?.url || '';
    const msg = e?.response?.data?.error || e?.message || fallback;
    Alert.alert('Error', `${msg}${status ? ` (HTTP ${status})` : ''}\n${base}${url}`);
  };

  useEffect(() => {
    if (!api) return; // wait for token
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/summary', { params: { date: todayKey } });
        if (!mounted) return;
        setGoals(res.data.goals);
        setEntry(res.data.entry);
        setDone(res.data.done);
      } catch (e) {
        showErr('Failed to load habits', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [api, todayKey]);

  const changeWater = async (delta) => {
    if (!api || busy) return;
    try {
      setBusy(true);
      const res = await api.post('/entry', { date: todayKey, incWater: delta });
      setEntry(p => ({ ...p, waterCount: res.data.waterCount }));
      setDone(res.data.completed);
    } catch (e) { showErr('Could not update water', e); } finally { setBusy(false); }
  };

  const changeSleep = async (delta) => {
    if (!api || busy) return;
    try {
      setBusy(true);
      const newVal = Math.max(0, (entry.sleepHours || 0) + delta);
      const res = await api.post('/entry', { date: todayKey, sleepHours: newVal });
      setEntry(p => ({ ...p, sleepHours: res.data.sleepHours }));
      setDone(res.data.completed);
    } catch (e) { showErr('Could not update sleep', e); } finally { setBusy(false); }
  };

  const toggleStepsDone = async () => {
    if (!api || busy) return;
    try {
      setBusy(true);
      const res = await api.post('/entry', { date: todayKey, stepsDone: !done.steps });
      setEntry(p => ({ ...p, steps: res.data.steps }));
      setDone(res.data.completed);
    } catch (e) { showErr('Could not update steps', e); } finally { setBusy(false); }
  };

  if (!token) {
    return (<SafeAreaView style={styles.container}><Header title="Habits" /><View style={{ padding: 24 }}><Text style={{ color: '#fff' }}>You are not logged in.</Text></View></SafeAreaView>);
  }

  if (loading) {
    return (<SafeAreaView style={styles.container}><Header title="Habits" /><View style={{ padding: 24 }}><ActivityIndicator color="#5856D6" /></View></SafeAreaView>);
  }

  const waterPct = Math.min(1, (entry.waterCount || 0) / (goals.waterTarget || 1));
  const sleepPct = Math.min(1, (entry.sleepHours || 0) / (goals.sleepTarget || 1));
  const stepsPct = Math.min(1, (entry.steps || 0) / (goals.stepsTarget || 1));

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Habits" />
      <LinearGradient colors={['#6B73FF', '#000DFF']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
        <View><Text style={styles.heroTitle}>Daily Progress</Text><Text style={styles.heroDate}>{new Date().toDateString()}</Text></View>
        <View style={styles.pillsRow}>
          <StatPill icon="💧" label={`${Math.round(waterPct*100)}% water`} />
          <StatPill icon="🛌" label={`${Math.round(sleepPct*100)}% sleep`} />
          <StatPill icon="👟" label={`${Math.round(stepsPct*100)}% steps`} />
        </View>
      </LinearGradient>

      {/* WATER */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrap, { backgroundColor: '#0ea5e9' }]}><Ionicons name="water-outline" color="#fff" size={20}/></View>
          <Text style={styles.cardTitle}>Water</Text>
          <View style={[styles.badge, done.water && styles.badgeDone]}>
            <Ionicons name={done.water ? 'checkmark' : 'ellipse-outline'} size={14} color={done.water ? '#0f0' : '#999'} />
          </View>
        </View>
        <Text style={styles.cardMeta}>{entry.waterCount} / {goals.waterTarget} glasses</Text>
        <ProgressBar value={entry.waterCount} target={goals.waterTarget} />
        <View style={styles.actionsRow}>
          <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeWater(-1)}><Ionicons name="remove" size={20} color="#fff" /></TouchableOpacity>
          <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeWater(+1)}><Ionicons name="add" size={20} color="#fff" /></TouchableOpacity>
        </View>
      </View>

      {/* SLEEP */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrap, { backgroundColor: '#a855f7' }]}><Ionicons name="moon-outline" color="#fff" size={20}/></View>
          <Text style={styles.cardTitle}>Sleep</Text>
          <View style={[styles.badge, done.sleep && styles.badgeDone]}>
            <Ionicons name={done.sleep ? 'checkmark' : 'ellipse-outline'} size={14} color={done.sleep ? '#0f0' : '#999'} />
          </View>
        </View>
        <Text style={styles.cardMeta}>{entry.sleepHours}h • goal {goals.sleepTarget}h</Text>
        <ProgressBar value={entry.sleepHours} target={goals.sleepTarget} />
        <View style={styles.actionsRow}>
          <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeSleep(-1)}><Ionicons name="remove" size={20} color="#fff" /></TouchableOpacity>
          <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeSleep(+1)}><Ionicons name="add" size={20} color="#fff" /></TouchableOpacity>
        </View>
      </View>

      {/* STEPS */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrap, { backgroundColor: '#22c55e' }]}><Ionicons name="walk-outline" color="#fff" size={20}/></View>
          <Text style={styles.cardTitle}>Steps</Text>
          <View style={[styles.badge, done.steps && styles.badgeDone]}>
            <Ionicons name={done.steps ? 'checkmark' : 'ellipse-outline'} size={14} color={done.steps ? '#0f0' : '#999'} />
          </View>
        </View>
        <Text style={styles.cardMeta}>
          {done.steps ? `Done (${entry.steps}/${goals.stepsTarget})` : `Not done (${entry.steps}/${goals.stepsTarget})`}
        </Text>
        <ProgressBar value={entry.steps} target={goals.stepsTarget} />
        <View style={styles.actionsRow}>
          <TouchableOpacity disabled={busy} style={[styles.markBtn, done.steps ? styles.markBtnOn : styles.markBtnOff, busy && styles.disabled]} onPress={toggleStepsDone} activeOpacity={0.85}>
            <Ionicons name={done.steps ? 'checkmark-circle' : 'ellipse-outline'} size={18} color="#fff" />
            <Text style={styles.markTxt}>{done.steps ? 'Completed — tap to undo' : 'Mark steps as done'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom actions */}
      <View style={{ height: 12 }} />
      <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('HabitsGoals')}><Text style={styles.primaryTxt}>Change goals</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.primary, styles.secondary]} onPress={() => navigation.navigate('HabitsStats')}><Text style={styles.primaryTxt}>View statistics</Text></TouchableOpacity>
      <View style={{ height: 16 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0B0B0F' },
  hero:{ margin:16, borderRadius:16, padding:16 },
  heroTitle:{ color:'#fff', fontSize:20, fontWeight:'800' },
  heroDate:{ color:'#E5E7EB', marginTop:4 },
  pillsRow:{ flexDirection:'row', marginTop:12 },
  statPill:{ backgroundColor:'rgba(255,255,255,0.13)', borderRadius:999, paddingVertical:6, paddingHorizontal:12, marginRight:8, flexDirection:'row', alignItems:'center' },
  statIcon:{ fontSize:14, marginRight:6 },
  statLabel:{ color:'#fff', fontWeight:'600', fontSize:12 },
  card:{ backgroundColor:'#141419', borderRadius:16, padding:16, marginHorizontal:16, marginTop:12, borderWidth:1, borderColor:'#1F2230' },
  cardHeader:{ flexDirection:'row', alignItems:'center' },
  iconWrap:{ width:32, height:32, borderRadius:8, alignItems:'center', justifyContent:'center', marginRight:10 },
  cardTitle:{ color:'#fff', fontSize:16, fontWeight:'800', flex:1 },
  badge:{ width:22, height:22, borderRadius:11, alignItems:'center', justifyContent:'center', backgroundColor:'#222' },
  badgeDone:{ backgroundColor:'#113' },
  cardMeta:{ color:'#9CA3AF', marginTop:8, marginBottom:10 },
  progress:{ height:10, backgroundColor:'#1F2230', borderRadius:999, overflow:'hidden' },
  progressFill:{ height:10, backgroundColor:'#5856D6' },
  actionsRow:{ flexDirection:'row', marginTop:12 },
  actionBtn:{ backgroundColor:'#222433', borderRadius:12, paddingVertical:10, paddingHorizontal:14, marginRight:10, borderWidth:1, borderColor:'#2B2E44' },
  markBtn:{ flexDirection:'row', alignItems:'center', borderRadius:12, paddingVertical:12, paddingHorizontal:14 },
  markBtnOn:{ backgroundColor:'#2563eb', borderWidth:1, borderColor:'#3b82f6' },
  markBtnOff:{ backgroundColor:'#374151', borderWidth:1, borderColor:'#4b5563' },
  markTxt:{ color:'#fff', fontWeight:'700', marginLeft:8 },
  primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginHorizontal:16 },
  secondary:{ backgroundColor:'#4543b6', marginTop:10 },
  primaryTxt:{ color:'#fff', fontWeight:'800' },
  disabled:{ opacity:0.5 }
});
