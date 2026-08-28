import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Switch } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { BluetoothHeartRateManager, HeartRateData } from './src/lib/bluetoothHeartRate';

export default function App() {
  const [activeTab, setActiveTab] = useState<'workout' | 'assessment' | 'hrv'>('workout');
  const [viewMode, setViewMode] = useState<'senior' | 'standard'>('senior');
  
  // Profile
  const [age, setAge] = useState(49);
  const [mafMax, setMafMax] = useState(131);
  const [mafLow, setMafLow] = useState(121);
  
  // Live State
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [currentBpm, setCurrentBpm] = useState(126);
  const [durationSec, setDurationSec] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [deviceName, setDeviceName] = useState('Dev Simulator (Polar H10)');

  const bleManager = BluetoothHeartRateManager.getInstance();

  useEffect(() => {
    const handleHr = (data: HeartRateData) => {
      setCurrentBpm(data.bpm);
    };
    bleManager.addHeartRateListener(handleHr);
    return () => bleManager.removeHeartRateListener(handleHr);
  }, []);

  useEffect(() => {
    let timer: any = null;
    if (isWorkingOut) {
      bleManager.startMockSimulator(mafMax);
      timer = setInterval(() => {
        setDurationSec(s => s + 1);
      }, 1000);
    } else {
      bleManager.stopMockSimulator();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isWorkingOut, mafMax]);

  const speak = (msg: string) => {
    if (!voiceEnabled) return;
    Speech.speak(msg, { language: 'nb-NO', rate: 0.95 });
  };

  const toggleWorkout = () => {
    if (!isWorkingOut) {
      setIsWorkingOut(true);
      setDurationSec(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      speak(`MAF økt startet. Målsonen din er ${mafLow} til ${mafMax} slag i minuttet.`);
    } else {
      setIsWorkingOut(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      const min = Math.round(durationSec / 60) || 1;
      speak(`Økt fullført. Varighet ${min} minutter. Flott innsats!`);
    }
  };

  const isOver = currentBpm > mafMax;
  const inZone = currentBpm >= mafLow && currentBpm <= mafMax;
  const statusColor = isOver ? '#ef4444' : inZone ? '#10b981' : '#f59e0b';
  const statusText = isOver ? 'FOR HØY PULS — RO NED' : inZone ? 'PERFEKT MAF FETTFORBRENNING' : 'OPPVARMING / LITT LAV';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>SUN Longevity</Text>
          <Text style={styles.headerSub}>MAF 180 Aerobic Engine</Text>
        </View>
        <View style={styles.voiceToggle}>
          <Text style={{ color: '#94a3b8', fontSize: 10, marginRight: 6 }}>Tale:</Text>
          <Switch value={voiceEnabled} onValueChange={setVoiceEnabled} trackColor={{ true: '#10b981', false: '#334155' }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Mode Selector */}
        <View style={styles.modeRow}>
          <TouchableOpacity 
            style={[styles.modeBtn, viewMode === 'senior' && styles.modeBtnActive]} 
            onPress={() => setViewMode('senior')}
          >
            <Text style={[styles.modeBtnText, viewMode === 'senior' && styles.modeBtnTextActive]}>👵 Enkel / Senior</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeBtn, viewMode === 'standard' && styles.modeBtnActive]} 
            onPress={() => setViewMode('standard')}
          >
            <Text style={[styles.modeBtnText, viewMode === 'standard' && styles.modeBtnTextActive]}>🏃‍♂️ Standard MAF</Text>
          </TouchableOpacity>
        </View>

        {/* Pulse Card */}
        <View style={[styles.card, { borderColor: statusColor, borderWidth: 2 }]}>
          <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{statusText}</Text>
          </View>

          <Text style={styles.label}>NÅVÆRENDE PULS</Text>
          <Text style={[styles.bpmText, { color: statusColor }]}>{currentBpm}</Text>
          <Text style={styles.unit}>BPM (Slag / min)</Text>

          <View style={styles.metricRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Din MAF-Sone</Text>
              <Text style={styles.metricVal}>{mafLow}–{mafMax} BPM</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Varighet</Text>
              <Text style={styles.metricVal}>
                {Math.floor(durationSec / 60)}m {durationSec % 60}s
              </Text>
            </View>
          </View>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: isWorkingOut ? '#ef4444' : '#10b981' }]} 
          onPress={toggleWorkout}
        >
          <Text style={styles.actionBtnText}>
            {isWorkingOut ? '■ Fullfør & Lagre Økt' : '▶ Start MAF-Treningsøkt'}
          </Text>
        </TouchableOpacity>

        {/* Device Status */}
        <View style={styles.deviceBox}>
          <Text style={styles.deviceText}>Sensor: {deviceName}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 11,
  },
  voiceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#0f172a',
    padding: 4,
    borderRadius: 12,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeBtnActive: {
    backgroundColor: '#10b981',
  },
  modeBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: '#020617',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  label: {
    color: '#64748b',
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: 'bold',
  },
  bpmText: {
    fontSize: 84,
    fontWeight: '900',
    marginVertical: 4,
  },
  unit: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 20,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  metricVal: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  actionBtn: {
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceBox: {
    padding: 12,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  deviceText: {
    color: '#64748b',
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
