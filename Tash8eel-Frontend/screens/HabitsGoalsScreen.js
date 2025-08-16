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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL_JO } from '../config';
import Header from '../components/Header';

// ---- Reusable input (outside component to keep identity stable)
const GoalItem = React.forwardRef(function GoalItem(
  { label, value, onChangeText, onSubmitEditing, returnKeyType = 'next', autoFocus = false },
  ref
) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        placeholderTextColor="#888"
        returnKeyType={returnKeyType}
        blurOnSubmit={false}
        autoFocus={autoFocus}
      />
    </View>
  );
});

export default function HabitsGoalsScreen({ navigation }) {
  const token = useSelector(s => s.auth.token);
  const api = useMemo(() => token ? axios.create({
    baseURL: `${API_BASE_URL_JO}/api/habits`,
    headers: { Authorization: `Bearer ${token}` }
  }) : null, [token]);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ waterTarget: '', sleepTarget: '', stepsTarget: '' });

  // Refs to chain focus
  const waterRef = useRef(null);
  const sleepRef = useRef(null);
  const stepsRef = useRef(null);

  // Only digits helper
  const setNumeric = (key) => (text) => {
    const digitsOnly = text.replace(/[^\d]/g, '');
    setForm(s => ({ ...s, [key]: digitsOnly }));
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Change goals" />

      <GoalItem
        label="Water target (glasses)"
        value={form.waterTarget}
        onChangeText={setNumeric('waterTarget')}
        ref={waterRef}
        onSubmitEditing={() => sleepRef.current?.focus()}
        autoFocus
      />

      <GoalItem
        label="Sleep target (hours)"
        value={form.sleepTarget}
        onChangeText={setNumeric('sleepTarget')}
        ref={sleepRef}
        onSubmitEditing={() => stepsRef.current?.focus()}
      />

      <GoalItem
        label="Steps target"
        value={form.stepsTarget}
        onChangeText={setNumeric('stepsTarget')}
        ref={stepsRef}
        onSubmitEditing={save}
        returnKeyType="done"
      />

      <TouchableOpacity style={styles.primary} onPress={save}>
        <Text style={styles.primaryTxt}>Save</Text>
      </TouchableOpacity>
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
