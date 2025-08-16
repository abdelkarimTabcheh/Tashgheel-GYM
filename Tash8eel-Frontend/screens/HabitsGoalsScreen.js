// // src/screens/HabitsGoalsScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput } from 'react-native';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';

// export default function HabitsGoalsScreen({ navigation }) {
//   const token = useSelector(s => s.auth.token);
//   const api = axios.create({ baseURL: `${API_BASE_URL_JO}/api/habits`, headers: { Authorization: `Bearer ${token}` } });

//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ waterTarget: '', sleepTarget: '', stepsTarget: '' });

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get('/summary'); // today is fine, includes goals
//         setForm({
//           waterTarget: String(res.data.goals.waterTarget),
//           sleepTarget: String(res.data.goals.sleepTarget),
//           stepsTarget: String(res.data.goals.stepsTarget),
//         });
//       } finally { setLoading(false); }
//     })();
//   }, []);

//   const save = async () => {
//     const payload = {
//       waterTarget: Number(form.waterTarget) || 0,
//       sleepTarget: Number(form.sleepTarget) || 0,
//       stepsTarget: Number(form.stepsTarget) || 0,
//     };
//     await api.put('/goals', payload);
//     navigation.goBack();
//   };

//   if (loading) {
//     return (<SafeAreaView style={styles.container}><Header title="Change goals" /><ActivityIndicator color="#5856D6" style={{ marginTop: 24 }}/></SafeAreaView>);
//   }

//   const Item = ({ label, valueKey, keyboardType='numeric' }) => (
//     <View style={styles.group}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         style={styles.input}
//         value={form[valueKey]}
//         onChangeText={v => setForm(s => ({ ...s, [valueKey]: v }))}
//         keyboardType={keyboardType}
//         placeholderTextColor="#888"
//       />
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Change goals" />
//       <Item label="Water target (glasses)" valueKey="waterTarget" />
//       <Item label="Sleep target (hours)" valueKey="sleepTarget" />
//       <Item label="Steps target" valueKey="stepsTarget" />
//       <TouchableOpacity style={styles.primary} onPress={save}><Text style={styles.primaryTxt}>Save</Text></TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#1C1C1E', paddingHorizontal:24 },
//   group:{ marginTop:16 },
//   label:{ color:'#B0B0B0', marginBottom:6 },
//   input:{ backgroundColor:'#2C2C2E', color:'#fff', borderRadius:12, padding:12, borderWidth:1, borderColor:'#555' },
//   primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginTop:24 },
//   primaryTxt:{ color:'#fff', fontWeight:'700' },
// });

































// // screens/HabitsGoalsScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, Alert } from 'react-native';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';

// export default function HabitsGoalsScreen({ navigation }) {
//   const token = useSelector(s => s.auth.token);
//   const api = axios.create({ baseURL: `${API_BASE_URL_JO}/api/habits`, headers: { Authorization: `Bearer ${token}` } });

//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ waterTarget: '', sleepTarget: '', stepsTarget: '' });

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get('/goals');
//         const g = res.data || {};
//         setForm({
//           waterTarget: String(g.waterTarget ?? g.waterGoal ?? 10),
//           sleepTarget: String(g.sleepTarget ?? g.sleepGoalHours ?? 8),
//           stepsTarget: String(g.stepsTarget ?? g.stepsGoal ?? 10000),
//         });
//       } catch {
//         Alert.alert('Error', 'Failed to load goals');
//       } finally { setLoading(false); }
//     })();
//   }, []);

//   const save = async () => {
//     try {
//       await api.put('/goals', {
//         // accept both old/new names on server; we send the legacy the server expects
//         waterGoal: Number(form.waterTarget) || 0,
//         sleepGoalHours: Number(form.sleepTarget) || 0,
//         stepsGoal: Number(form.stepsTarget) || 0,
//       });
//       navigation.goBack();
//     } catch {
//       Alert.alert('Error', 'Could not save goals');
//     }
//   };

//   if (loading) {
//     return (<SafeAreaView style={styles.container}><Header title="Change goals" /><ActivityIndicator color="#5856D6" style={{ marginTop: 24 }}/></SafeAreaView>);
//   }

//   const Item = ({ label, valueKey, keyboardType='numeric' }) => (
//     <View style={styles.group}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         style={styles.input}
//         value={form[valueKey]}
//         onChangeText={v => setForm(s => ({ ...s, [valueKey]: v }))}
//         keyboardType={keyboardType}
//         placeholderTextColor="#888"
//       />
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Change goals" />
//       <Item label="Water target (glasses)" valueKey="waterTarget" />
//       <Item label="Sleep target (hours)" valueKey="sleepTarget" />
//       <Item label="Steps target" valueKey="stepsTarget" />
//       <TouchableOpacity style={styles.primary} onPress={save}><Text style={styles.primaryTxt}>Save</Text></TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#1C1C1E', paddingHorizontal:24 },
//   group:{ marginTop:16 },
//   label:{ color:'#B0B0B0', marginBottom:6 },
//   input:{ backgroundColor:'#2C2C2E', color:'#fff', borderRadius:12, padding:12, borderWidth:1, borderColor:'#555' },
//   primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginTop:24 },
//   primaryTxt:{ color:'#fff', fontWeight:'700' },
// });

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, Alert } from 'react-native';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';

// export default function HabitsGoalsScreen({ navigation }) {
//   const token = useSelector(s => s.auth.token);
//   const api = axios.create({ baseURL: `${API_BASE_URL_JO}/api/habits`, headers: { Authorization: `Bearer ${token}` } });

//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ waterTarget: '', sleepTarget: '', stepsTarget: '' });

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get('/goals'); // ← load from /goals
//         setForm({
//           waterTarget: String(res.data.waterTarget ?? ''),
//           sleepTarget: String(res.data.sleepTarget ?? ''),
//           stepsTarget: String(res.data.stepsTarget ?? ''),
//         });
//       } catch (e) {
//         Alert.alert('Error', 'Failed to load goals');
//       } finally { setLoading(false); }
//     })();
//   }, []);

//   const save = async () => {
//     try {
//       const payload = {
//         waterTarget: Number(form.waterTarget) || 0,
//         sleepTarget: Number(form.sleepTarget) || 0,
//         stepsTarget: Number(form.stepsTarget) || 0,
//       };
//       await api.put('/goals', payload);
//       navigation.goBack();
//     } catch (e) {
//       Alert.alert('Error', 'Failed to save goals');
//     }
//   };

//   if (loading) {
//     return (<SafeAreaView style={styles.container}><Header title="Change goals" /><ActivityIndicator color="#5856D6" style={{ marginTop: 24 }}/></SafeAreaView>);
//   }

//   const Item = ({ label, valueKey }) => (
//     <View style={styles.group}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         style={styles.input}
//         value={form[valueKey]}
//         onChangeText={v => setForm(s => ({ ...s, [valueKey]: v }))}
//         keyboardType='numeric'
//         placeholderTextColor="#888"
//       />
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Change goals" />
//       <Item label="Water target (glasses)" valueKey="waterTarget" />
//       <Item label="Sleep target (hours)" valueKey="sleepTarget" />
//       <Item label="Steps target" valueKey="stepsTarget" />
//       <TouchableOpacity style={styles.primary} onPress={save}><Text style={styles.primaryTxt}>Save</Text></TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#1C1C1E', paddingHorizontal:24 },
//   group:{ marginTop:16 },
//   label:{ color:'#B0B0B0', marginBottom:6 },
//   input:{ backgroundColor:'#2C2C2E', color:'#fff', borderRadius:12, padding:12, borderWidth:1, borderColor:'#555' },
//   primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginTop:24 },
//   primaryTxt:{ color:'#fff', fontWeight:'700' },
// });




















// import React, { useEffect, useMemo, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, Alert } from 'react-native';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL_JO } from '../config';
// import Header from '../components/Header';

// export default function HabitsGoalsScreen({ navigation }) {
//   const token = useSelector(s => s.auth.token);
//   const api = useMemo(() => token ? axios.create({
//     baseURL: `${API_BASE_URL_JO}/api/habits`,
//     headers: { Authorization: `Bearer ${token}` }
//   }) : null, [token]);

//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ waterTarget: '', sleepTarget: '', stepsTarget: '' });

//   useEffect(() => {
//     if (!api) return;
//     (async () => {
//       try {
//         const res = await api.get('/goals');
//         setForm({
//           waterTarget: String(res.data.waterTarget ?? ''),
//           sleepTarget: String(res.data.sleepTarget ?? ''),
//           stepsTarget: String(res.data.stepsTarget ?? ''),
//         });
//       } catch (e) {
//         Alert.alert('Error', e?.response?.data?.error || e.message || 'Failed to load goals');
//       } finally { setLoading(false); }
//     })();
//   }, [api]);

//   const save = async () => {
//     try {
//       const payload = {
//         waterTarget: Number(form.waterTarget) || 0,
//         sleepTarget: Number(form.sleepTarget) || 0,
//         stepsTarget: Number(form.stepsTarget) || 0,
//       };
//       await api.put('/goals', payload);
//       navigation.goBack();
//     } catch (e) {
//       Alert.alert('Error', e?.response?.data?.error || e.message || 'Failed to save goals');
//     }
//   };

//   if (!token) return <SafeAreaView style={styles.container}><Header title="Change goals" /><Text style={{color:'#fff', margin:16}}>You are not logged in.</Text></SafeAreaView>;
//   if (loading) return <SafeAreaView style={styles.container}><Header title="Change goals" /><ActivityIndicator color="#5856D6" style={{ marginTop: 24 }}/></SafeAreaView>;

//   const Item = ({ label, valueKey }) => (
//     <View style={styles.group}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         style={styles.input}
//         value={form[valueKey]}
//         onChangeText={v => setForm(s => ({ ...s, [valueKey]: v }))}
//         keyboardType='numeric'
//         placeholderTextColor="#888"
//       />
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Change goals" />
//       <Item label="Water target (glasses)" valueKey="waterTarget" />
//       <Item label="Sleep target (hours)" valueKey="sleepTarget" />
//       <Item label="Steps target" valueKey="stepsTarget" />
//       <TouchableOpacity style={styles.primary} onPress={save}><Text style={styles.primaryTxt}>Save</Text></TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#1C1C1E', paddingHorizontal:24 },
//   group:{ marginTop:16 },
//   label:{ color:'#B0B0B0', marginBottom:6 },
//   input:{ backgroundColor:'#2C2C2E', color:'#fff', borderRadius:12, padding:12, borderWidth:1, borderColor:'#555' },
//   primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginTop:24 },
//   primaryTxt:{ color:'#fff', fontWeight:'700' },
// });
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL_JO } from '../config';
import Header from '../components/Header';

export default function HabitsGoalsScreen({ navigation }) {
  const token = useSelector(s => s.auth.token);
  const api = useMemo(() => token ? axios.create({
    baseURL: `${API_BASE_URL_JO}/api/habits`,
    headers: { Authorization: `Bearer ${token}` }
  }) : null, [token]);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ waterTarget: '', sleepTarget: '', stepsTarget: '' });

  useEffect(() => {
    if (!api) return;
    (async () => {
      try {
        const res = await api.get('/goals');
        setForm({
          waterTarget: String(res.data.waterTarget ?? ''),
          sleepTarget: String(res.data.sleepTarget ?? ''),
          stepsTarget: String(res.data.stepsTarget ?? ''),
        });
      } catch (e) {
        Alert.alert('Error', e?.response?.data?.error || e.message || 'Failed to load goals');
      } finally { setLoading(false); }
    })();
  }, [api]);

  const save = async () => {
    try {
      const payload = {
        waterTarget: Number(form.waterTarget) || 0,
        sleepTarget: Number(form.sleepTarget) || 0,
        stepsTarget: Number(form.stepsTarget) || 0,
      };
      await api.put('/goals', payload);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || e.message || 'Failed to save goals');
    }
  };

  if (!token) return <SafeAreaView style={styles.container}><Header title="Change goals" /><Text style={{color:'#fff', margin:16}}>You are not logged in.</Text></SafeAreaView>;
  if (loading) return <SafeAreaView style={styles.container}><Header title="Change goals" /><ActivityIndicator color="#5856D6" style={{ marginTop: 24 }}/></SafeAreaView>;

  const Item = ({ label, valueKey }) => (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={form[valueKey]}
        onChangeText={v => setForm(s => ({ ...s, [valueKey]: v }))}
        keyboardType='numeric'
        placeholderTextColor="#888"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Change goals" />
      <Item label="Water target (glasses)" valueKey="waterTarget" />
      <Item label="Sleep target (hours)" valueKey="sleepTarget" />
      <Item label="Steps target" valueKey="stepsTarget" />
      <TouchableOpacity style={styles.primary} onPress={save}><Text style={styles.primaryTxt}>Save</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#1C1C1E', paddingHorizontal:24 },
  group:{ marginTop:16 },
  label:{ color:'#B0B0B0', marginBottom:6 },
  input:{ backgroundColor:'#2C2C2E', color:'#fff', borderRadius:12, padding:12, borderWidth:1, borderColor:'#555' },
  primary:{ backgroundColor:'#5856D6', borderRadius:12, padding:14, alignItems:'center', marginTop:24 },
  primaryTxt:{ color:'#fff', fontWeight:'700' },
});
