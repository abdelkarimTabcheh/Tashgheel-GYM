import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    Pressable,
    SafeAreaView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header'; // Import the Header component

// Custom Modal Component to replace Alert
const ResetConfirmationModal = ({ isVisible, onCancel, onConfirm }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCancel}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.modalTitle}>Reset Timer</Text>
                    <Text style={modalStyles.modalText}>Are you sure you want to reset the timer? This will clear all laps.</Text>
                    <View style={modalStyles.buttonContainer}>
                        <Pressable
                            style={[modalStyles.button, modalStyles.buttonCancel]}
                            onPress={onCancel}
                        >
                            <Text style={modalStyles.textStyle}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[modalStyles.button, modalStyles.buttonReset]}
                            onPress={onConfirm}
                        >
                            <Text style={modalStyles.textStyle}>Reset</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default function TimerScreen({ navigation }) { // Added navigation prop
    const [milliseconds, setMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    const [showResetModal, setShowResetModal] = useState(false); // State for the custom modal
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setMilliseconds((prev) => prev + 10);
            }, 10);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const handleStartPause = () => {
        setIsRunning((prev) => !prev);
    };

    const handleReset = () => {
        // Show the custom modal instead of the native Alert
        setShowResetModal(true);
    };

    const confirmReset = () => {
        setIsRunning(false);
        setMilliseconds(0);
        setLaps([]);
        setShowResetModal(false);
    };

    const handleLap = () => {
        if (!isRunning) return;
        setLaps((prevLaps) => [milliseconds, ...prevLaps]);
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        const msPart = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
        return `${minutes}:${seconds}.${msPart}`;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1C1C1E' }}>
            {/* The new Header component is added here */}
            <Header title="Workout Timer" onBackPress={() => navigation.goBack()} />

            <View style={styles.container}>
                {/* The old header text is removed */}
                <View style={styles.timerBox}>
                    <Text style={styles.timeText}>{formatTime(milliseconds)}</Text>
                </View>

                <View style={styles.buttonsRow}>
                    <TouchableOpacity onPress={handleStartPause} activeOpacity={0.9}>
                        <LinearGradient
                            colors={isRunning ? ['#FF6B6B', '#FF8E53'] : ['#5856D6', '#8A56D6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleLap}
                        disabled={!isRunning}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#5856D6', '#8A56D6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.gradientButton, !isRunning && styles.disabled]}
                        >
                            <Text style={styles.buttonText}>Lap</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleReset} activeOpacity={0.9}>
                        <LinearGradient
                            colors={['#6B7280', '#4B5563']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>Reset</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {laps.length > 0 && (
                    <View style={styles.lapsSection}>
                        <Text style={styles.lapsTitle}>Laps</Text>
                        <FlatList
                            data={laps}
                            keyExtractor={(_, i) => i.toString()}
                            renderItem={({ item, index }) => (
                                <View style={styles.lapItem}>
                                    <Text style={styles.lapLabel}>Lap {laps.length - index}</Text>
                                    <Text style={styles.lapTime}>{formatTime(item)}</Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>

            <ResetConfirmationModal
                isVisible={showResetModal}
                onCancel={() => setShowResetModal(false)}
                onConfirm={confirmReset}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#1C1C1E',
    },
    timerBox: {
        backgroundColor: '#3A3A3C',
        borderRadius: 16,
        paddingVertical: 40,
        marginHorizontal: 0,
        marginBottom: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 8,
    },
    timeText: {
        fontSize: 52,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    gradientButton: {
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginHorizontal: 5,
        minWidth: 90,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    disabled: {
        opacity: 0.5,
    },
    lapsSection: {
        flex: 1,
        marginTop: 10,
    },
    lapsTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#B0B0B0',
    },
    lapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#3A3A3C',
        padding: 14,
        marginBottom: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    lapLabel: {
        fontSize: 16,
        color: '#B0B0B0',
    },
    lapTime: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "#2C2C2E",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF'
    },
    modalText: {
        marginBottom: 25,
        textAlign: "center",
        fontSize: 16,
        color: '#B0B0B0'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonCancel: {
        backgroundColor: "#555",
    },
    buttonReset: {
        backgroundColor: "#FF6B6B",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
});
