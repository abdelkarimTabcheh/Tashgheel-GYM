// import React, { useEffect, useMemo, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const isoDay = (d = new Date()) => { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); };

// const ProgressBar = ({ value = 0, target = 1 }) => {
//   const pct = Math.max(0, Math.min(1, target ? value / target : 0));
//   return <View style={styles.progress}><View style={[styles.progressFill, { width: `${pct * 100}%` }]} /></View>;
// };

// const StatPill = ({ icon, label }) => (
//   <View style={styles.statPill}><Text style={styles.statIcon}>{icon}</Text><Text style={styles.statLabel}>{label}</Text></View>
// );

// export default function HabitsScreen({ navigation }) {
//   const token = useSelector(s => s.auth.token);

//   const [loading, setLoading] = useState(true);
//   const [busy, setBusy] = useState(false);
//   const [entry, setEntry] = useState({ waterCount: 0, sleepHours: 0, steps: 0 });
//   const [goals, setGoals] = useState({ waterTarget: 10, sleepTarget: 8, stepsTarget: 10000 });
//   const [done, setDone] = useState({ water: false, sleep: false, steps: false });

//   const todayKey = useMemo(() => isoDay(), []);
//   const api = useMemo(() => token ? axios.create({
//     baseURL: `${API_BASE_URL_JO}/api/habits`,
//     headers: { Authorization: `Bearer ${token}` }
//   }) : null, [token]);

//   const showErr = (fallback, e) => {
//     const status = e?.response?.status;
//     const base = e?.config?.baseURL || '';
//     const url = e?.config?.url || '';
//     const msg = e?.response?.data?.error || e?.message || fallback;
//     Alert.alert('Error', `${msg}${status ? ` (HTTP ${status})` : ''}\n${base}${url}`);
//   };

//   useEffect(() => {
//     if (!api) return; // wait for token
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
//       setEntry(p => ({ ...p, waterCount: res.data.waterCount }));
//       setDone(res.data.completed);
//     } catch (e) { showErr('Could not update water', e); } finally { setBusy(false); }
//   };

//   const changeSleep = async (delta) => {
//     if (!api || busy) return;
//     try {
//       setBusy(true);
//       const newVal = Math.max(0, (entry.sleepHours || 0) + delta);
//       const res = await api.post('/entry', { date: todayKey, sleepHours: newVal });
//       setEntry(p => ({ ...p, sleepHours: res.data.sleepHours }));
//       setDone(res.data.completed);
//     } catch (e) { showErr('Could not update sleep', e); } finally { setBusy(false); }
//   };

//   const toggleStepsDone = async () => {
//     if (!api || busy) return;
//     try {
//       setBusy(true);
//       const res = await api.post('/entry', { date: todayKey, stepsDone: !done.steps });
//       setEntry(p => ({ ...p, steps: res.data.steps }));
//       setDone(res.data.completed);
//     } catch (e) { showErr('Could not update steps', e); } finally { setBusy(false); }
//   };

//   if (!token) {
//     return (<SafeAreaView style={styles.container}><Header title="Habits" /><View style={{ padding: 24 }}><Text style={{ color: '#fff' }}>You are not logged in.</Text></View></SafeAreaView>);
//   }

//   if (loading) {
//     return (<SafeAreaView style={styles.container}><Header title="Habits" /><View style={{ padding: 24 }}><ActivityIndicator color="#5856D6" /></View></SafeAreaView>);
//   }

//   const waterPct = Math.min(1, (entry.waterCount || 0) / (goals.waterTarget || 1));
//   const sleepPct = Math.min(1, (entry.sleepHours || 0) / (goals.sleepTarget || 1));
//   const stepsPct = Math.min(1, (entry.steps || 0) / (goals.stepsTarget || 1));

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Habits" />
//       <LinearGradient colors={['#6B73FF', '#000DFF']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
//         <View><Text style={styles.heroTitle}>Daily Progress</Text><Text style={styles.heroDate}>{new Date().toDateString()}</Text></View>
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
//           <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeWater(-1)}><Ionicons name="remove" size={20} color="#fff" /></TouchableOpacity>
//           <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeWater(+1)}><Ionicons name="add" size={20} color="#fff" /></TouchableOpacity>
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
//           <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeSleep(-1)}><Ionicons name="remove" size={20} color="#fff" /></TouchableOpacity>
//           <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeSleep(+1)}><Ionicons name="add" size={20} color="#fff" /></TouchableOpacity>
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
//           <TouchableOpacity disabled={busy} style={[styles.markBtn, done.steps ? styles.markBtnOn : styles.markBtnOff, busy && styles.disabled]} onPress={toggleStepsDone} activeOpacity={0.85}>
//             <Ionicons name={done.steps ? 'checkmark-circle' : 'ellipse-outline'} size={18} color="#fff" />
//             <Text style={styles.markTxt}>{done.steps ? 'Completed — tap to undo' : 'Mark steps as done'}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Bottom actions */}
//       <View style={{ height: 12 }} />
//       <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('HabitsGoals')}><Text style={styles.primaryTxt}>Change goals</Text></TouchableOpacity>
//       <TouchableOpacity style={[styles.primary, styles.secondary]} onPress={() => navigation.navigate('HabitsStats')}><Text style={styles.primaryTxt}>View statistics</Text></TouchableOpacity>
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
// import React, { useEffect, useMemo, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context'; // ✅ NEW

// const isoDay = (d = new Date()) => { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); };

// const ProgressBar = ({ value = 0, target = 1 }) => {
//   const pct = Math.max(0, Math.min(1, target ? value / target : 0));
//   return <View style={styles.progress}><View style={[styles.progressFill, { width: `${pct * 100}%` }]} /></View>;
// };

// const StatPill = ({ icon, label }) => (
//   <View style={styles.statPill}><Text style={styles.statIcon}>{icon}</Text><Text style={styles.statLabel}>{label}</Text></View>
// );

// export default function HabitsScreen({ navigation }) {
//   const token = useSelector(s => s.auth.token);
//   const insets = useSafeAreaInsets(); // ✅ NEW

//   const [loading, setLoading] = useState(true);
//   const [busy, setBusy] = useState(false);
//   const [entry, setEntry] = useState({ waterCount: 0, sleepHours: 0, steps: 0 });
//   const [goals, setGoals] = useState({ waterTarget: 10, sleepTarget: 8, stepsTarget: 10000 });
//   const [done, setDone] = useState({ water: false, sleep: false, steps: false });

//   const todayKey = useMemo(() => isoDay(), []);
//   const api = useMemo(() => token ? axios.create({
//     baseURL: `${API_BASE_URL_JO}/api/habits`,
//     headers: { Authorization: `Bearer ${token}` }
//   }) : null, [token]);

//   const showErr = (fallback, e) => {
//     const status = e?.response?.status;
//     const base = e?.config?.baseURL || '';
//     const url = e?.config?.url || '';
//     const msg = e?.response?.data?.error || e?.message || fallback;
//     Alert.alert('Error', `${msg}${status ? ` (HTTP ${status})` : ''}\n${base}${url}`);
//   };

//   useEffect(() => {
//     if (!api) return;
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
//       setEntry(p => ({ ...p, waterCount: res.data.waterCount }));
//       setDone(res.data.completed);
//     } catch (e) { showErr('Could not update water', e); } finally { setBusy(false); }
//   };

//   const changeSleep = async (delta) => {
//     if (!api || busy) return;
//     try {
//       setBusy(true);
//       const newVal = Math.max(0, (entry.sleepHours || 0) + delta);
//       const res = await api.post('/entry', { date: todayKey, sleepHours: newVal });
//       setEntry(p => ({ ...p, sleepHours: res.data.sleepHours }));
//       setDone(res.data.completed);
//     } catch (e) { showErr('Could not update sleep', e); } finally { setBusy(false); }
//   };

//   const toggleStepsDone = async () => {
//     if (!api || busy) return;
//     try {
//       setBusy(true);
//       const res = await api.post('/entry', { date: todayKey, stepsDone: !done.steps });
//       setEntry(p => ({ ...p, steps: res.data.steps }));
//       setDone(res.data.completed);
//     } catch (e) { showErr('Could not update steps', e); } finally { setBusy(false); }
//   };

//   if (!token) {
//     return (<SafeAreaView style={styles.container}><Header title="Habits" /><View style={{ padding: 24 }}><Text style={{ color: '#fff' }}>You are not logged in.</Text></View></SafeAreaView>);
//   }

//   if (loading) {
//     return (<SafeAreaView style={styles.container}><Header title="Habits" /><View style={{ padding: 24 }}><ActivityIndicator color="#5856D6" /></View></SafeAreaView>);
//   }

//   const waterPct = Math.min(1, (entry.waterCount || 0) / (goals.waterTarget || 1));
//   const sleepPct = Math.min(1, (entry.sleepHours || 0) / (goals.sleepTarget || 1));
//   const stepsPct = Math.min(1, (entry.steps || 0) / (goals.stepsTarget || 1));

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Habits" />

//       {/* Scrollable content */}
//       <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
//         <LinearGradient colors={['#6B73FF', '#000DFF']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
//           <View>
//             <Text style={styles.heroTitle}>Daily Progress</Text>
//             <Text style={styles.heroDate}>{new Date().toDateString()}</Text>
//           </View>
//           <View style={styles.pillsRow}>
//             <StatPill icon="💧" label={`${Math.round(waterPct*100)}% water`} />
//             <StatPill icon="🛌" label={`${Math.round(sleepPct*100)}% sleep`} />
//             <StatPill icon="👟" label={`${Math.round(stepsPct*100)}% steps`} />
//           </View>
//         </LinearGradient>

//         {/* WATER */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={[styles.iconWrap, { backgroundColor: '#0ea5e9' }]}><Ionicons name="water-outline" color="#fff" size={20}/></View>
//             <Text style={styles.cardTitle}>Water</Text>
//             <View style={[styles.badge, done.water && styles.badgeDone]}>
//               <Ionicons name={done.water ? 'checkmark' : 'ellipse-outline'} size={14} color={done.water ? '#0f0' : '#999'} />
//             </View>
//           </View>
//           <Text style={styles.cardMeta}>{entry.waterCount} / {goals.waterTarget} glasses</Text>
//           <ProgressBar value={entry.waterCount} target={goals.waterTarget} />
//           <View style={styles.actionsRow}>
//             <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeWater(-1)}><Ionicons name="remove" size={20} color="#fff" /></TouchableOpacity>
//             <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeWater(+1)}><Ionicons name="add" size={20} color="#fff" /></TouchableOpacity>
//           </View>
//         </View>

//         {/* SLEEP */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={[styles.iconWrap, { backgroundColor: '#a855f7' }]}><Ionicons name="moon-outline" color="#fff" size={20}/></View>
//             <Text style={styles.cardTitle}>Sleep</Text>
//             <View style={[styles.badge, done.sleep && styles.badgeDone]}>
//               <Ionicons name={done.sleep ? 'checkmark' : 'ellipse-outline'} size={14} color={done.sleep ? '#0f0' : '#999'} />
//             </View>
//           </View>
//           <Text style={styles.cardMeta}>{entry.sleepHours}h • goal {goals.sleepTarget}h</Text>
//           <ProgressBar value={entry.sleepHours} target={goals.sleepTarget} />
//           <View style={styles.actionsRow}>
//             <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeSleep(-1)}><Ionicons name="remove" size={20} color="#fff" /></TouchableOpacity>
//             <TouchableOpacity disabled={busy} style={[styles.actionBtn, busy && styles.disabled]} onPress={() => changeSleep(+1)}><Ionicons name="add" size={20} color="#fff" /></TouchableOpacity>
//           </View>
//         </View>

//         {/* STEPS */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={[styles.iconWrap, { backgroundColor: '#22c55e' }]}><Ionicons name="walk-outline" color="#fff" size={20}/></View>
//             <Text style={styles.cardTitle}>Steps</Text>
//             <View style={[styles.badge, done.steps && styles.badgeDone]}>
//               <Ionicons name={done.steps ? 'checkmark' : 'ellipse-outline'} size={14} color={done.steps ? '#0f0' : '#999'} />
//             </View>
//           </View>
//           <Text style={styles.cardMeta}>
//             {done.steps ? `Done (${entry.steps}/${goals.stepsTarget})` : `Not done (${entry.steps}/${goals.stepsTarget})`}
//           </Text>
//           <ProgressBar value={entry.steps} target={goals.stepsTarget} />
//           <View style={styles.actionsRow}>
//             <TouchableOpacity disabled={busy} style={[styles.markBtn, done.steps ? styles.markBtnOn : styles.markBtnOff, busy && styles.disabled]} onPress={toggleStepsDone} activeOpacity={0.85}>
//               <Ionicons name={done.steps ? 'checkmark-circle' : 'ellipse-outline'} size={18} color="#fff" />
//               <Text style={styles.markTxt}>{done.steps ? 'Completed — tap to undo' : 'Mark steps as done'}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       {/* ✅ Fixed footer with the two buttons */}
//       <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
//         <TouchableOpacity style={[styles.cta, styles.ctaSecondary]} onPress={() => navigation.navigate('HabitsStats')}>
//           <Ionicons name="stats-chart-outline" size={18} color="#fff" />
//           <Text style={styles.ctaTxt}>Statistics</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('HabitsGoals')}>
//           <Ionicons name="settings-outline" size={18} color="#fff" />
//           <Text style={styles.ctaTxt}>Change goals</Text>
//         </TouchableOpacity>
//       </View>
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

//   // ❌ OLD bottom buttons removed; replaced with footer.
//   primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginHorizontal:16 },
//   secondary:{ backgroundColor:'#4543b6', marginTop:10 },
//   primaryTxt:{ color:'#fff', fontWeight:'800' },
//   disabled:{ opacity:0.5 },

//   // ✅ NEW footer styles
//   footer:{
//     position:'absolute',
//     left:16,
//     right:16,
//     bottom:0,
//     backgroundColor:'rgba(20,20,25,0.9)',
//     borderTopLeftRadius:16,
//     borderTopRightRadius:16,
//     paddingTop:10,
//     paddingHorizontal:10,
//     flexDirection:'row',
//     gap:10,
//     borderWidth:1,
//     borderColor:'#1F2230',
//   },
//   cta:{
//     flex:1,
//     backgroundColor:'#5856D6',
//     borderRadius:12,
//     paddingVertical:12,
//     alignItems:'center',
//     justifyContent:'center',
//     flexDirection:'row',
//   },
//   ctaSecondary:{
//     backgroundColor:'#4543b6',
//   },
//   ctaTxt:{ color:'#fff', fontWeight:'800', marginLeft:8 },
// });
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL_JO } from '../config';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

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

  const fetchSummary = useCallback(async () => {
    if (!api) return;
    try {
      setLoading(true);
      const res = await api.get('/summary', { params: { date: todayKey } });
      setGoals(res.data.goals);
      setEntry(res.data.entry);
      setDone(res.data.done);
    } catch (e) {
      showErr('Failed to load habits', e);
    } finally {
      setLoading(false);
    }
  }, [api, todayKey]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  useFocusEffect(
    useCallback(() => {
      // Refetch whenever screen gains focus (e.g., after saving new goals)
      fetchSummary();
    }, [fetchSummary])
  );

  const changeWater = async (delta) => {
    if (!api || busy) return;
    const curr = entry.waterCount || 0;
    const max = goals.waterTarget || 0;
    let allowedDelta = delta;
    if (delta > 0) allowedDelta = Math.min(delta, Math.max(0, max - curr));
    if (delta < 0) allowedDelta = Math.max(delta, -curr);
    if (allowedDelta === 0) return;

    try {
      setBusy(true);
      const res = await api.post('/entry', { date: todayKey, incWater: allowedDelta });
      setEntry(p => ({ ...p, waterCount: res.data.waterCount }));
      setDone(res.data.completed);
    } catch (e) {
      showErr('Could not update water', e);
    } finally { setBusy(false); }
  };

  const changeSleep = async (delta) => {
    if (!api || busy) return;
    const curr = entry.sleepHours || 0;
    const max = goals.sleepTarget || 0;
    const newVal = Math.max(0, Math.min(max, curr + delta));
    if (newVal === curr) return;

    try {
      setBusy(true);
      const res = await api.post('/entry', { date: todayKey, sleepHours: newVal });
      setEntry(p => ({ ...p, sleepHours: res.data.sleepHours }));
      setDone(res.data.completed);
    } catch (e) {
      showErr('Could not update sleep', e);
    } finally { setBusy(false); }
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

  const waterAtMin = (entry.waterCount || 0) <= 0;
  const waterAtMax = (entry.waterCount || 0) >= (goals.waterTarget || 0);
  const sleepAtMin = (entry.sleepHours || 0) <= 0;
  const sleepAtMax = (entry.sleepHours || 0) >= (goals.sleepTarget || 0);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Habits" />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
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
            <TouchableOpacity
              disabled={busy || waterAtMin}
              style={[styles.actionBtn, (busy || waterAtMin) && styles.disabled]}
              onPress={() => changeWater(-1)}
            >
              <Ionicons name="remove" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={busy || waterAtMax}
              style={[styles.actionBtn, (busy || waterAtMax) && styles.disabled]}
              onPress={() => changeWater(+1)}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
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
            <TouchableOpacity
              disabled={busy || sleepAtMin}
              style={[styles.actionBtn, (busy || sleepAtMin) && styles.disabled]}
              onPress={() => changeSleep(-1)}
            >
              <Ionicons name="remove" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={busy || sleepAtMax}
              style={[styles.actionBtn, (busy || sleepAtMax) && styles.disabled]}
              onPress={() => changeSleep(+1)}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
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
            <TouchableOpacity
              disabled={busy}
              style={[styles.markBtn, done.steps ? styles.markBtnOn : styles.markBtnOff, busy && styles.disabled]}
              onPress={toggleStepsDone}
              activeOpacity={0.85}
            >
              <Ionicons name={done.steps ? 'checkmark-circle' : 'ellipse-outline'} size={18} color="#fff" />
              <Text style={styles.markTxt}>{done.steps ? 'Completed — tap to undo' : 'Mark steps as done'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom actions pinned */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={[styles.cta, styles.ctaSecondary]} onPress={() => navigation.navigate('HabitsStats')}>
          <Ionicons name="stats-chart-outline" size={18} color="#fff" />
          <Text style={styles.ctaTxt}>Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('HabitsGoals')}>
          <Ionicons name="settings-outline" size={18} color="#fff" />
          <Text style={styles.ctaTxt}>Change goals</Text>
        </TouchableOpacity>
      </View>
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
  disabled:{ opacity:0.5 },

  // Pinned footer
  footer:{
    position:'absolute',
    left:16,
    right:16,
    bottom:0,
    backgroundColor:'rgba(20,20,25,0.9)',
    borderTopLeftRadius:16,
    borderTopRightRadius:16,
    paddingTop:10,
    paddingHorizontal:10,
    flexDirection:'row',
    gap:10,
    borderWidth:1,
    borderColor:'#1F2230',
  },
  cta:{
    flex:1,
    backgroundColor:'#5856D6',
    borderRadius:12,
    paddingVertical:12,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
  },
  ctaSecondary:{ backgroundColor:'#4543b6' },
  ctaTxt:{ color:'#fff', fontWeight:'800', marginLeft:8 },
});
