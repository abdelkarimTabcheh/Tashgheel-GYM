import React, { useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import { colors } from '../theme/colors';

export default function CompletionModal({
    visible,
    onClose,
    challengeTitle,
    completionDate,
}) {
    const shotRef = useRef();

    const handleShare = async () => {
        try {
            const uri = await captureRef(shotRef, {
                format: 'png',
                quality: 0.9,
            });
            await Share.open({
                url: uri,
                type: 'image/png',
            });
        } catch (err) {
            console.warn('Share error', err);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <ViewShot
                    style={styles.card}
                    ref={shotRef}
                    options={{ format: 'png', quality: 0.9 }}
                    collapsable={false}
                >
                    <LottieView
                        source={{ uri: 'https://lottie.host/caf966b5-ca0c-4588-a27d-8fb900eb68bc/L3FG4l9pVV.lottie' }}
                        autoPlay
                        loop={true}
                        style={styles.animation}
                        useNativeDriver
                    />
                    <Icon name="award" size={48} color={colors.primary} />
                    <Text style={styles.title}>Congratulations!</Text>
                    <Text style={styles.subtitle}>You completed</Text>
                    <Text style={styles.challenge}>{challengeTitle}</Text>
                    <Text style={styles.date}>{completionDate}</Text>
                </ViewShot>

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={handleShare}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={["#5856D6", "#8A56D6"]} // Consistent gradient colors
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Share</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.buttonWrapper, styles.closeButtonWrapper]}
                        onPress={onClose}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.button, styles.closeButton]}>
                            <Text style={styles.buttonText}>Close</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)', // Slightly darker overlay
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: colors.card, // Dark card background
        borderRadius: 16,
        alignItems: 'center',
        padding: 24,
        elevation: 10, // Increased elevation for more depth
        shadowColor: colors.shadow, // Consistent shadow
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
    },
    animation: {
        width: 150,
        height: 150,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 8,
        color: colors.text, // Dark theme text color
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary, // Dark theme secondary text color
        marginVertical: 4,
    },
    challenge: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.primary, // Primary accent color
        textAlign: 'center',
        marginVertical: 4,
    },
    date: {
        fontSize: 14,
        color: colors.textSecondary, // Dark theme secondary text color
        marginTop: 8,
    },
    buttons: {
        flexDirection: 'row',
        marginTop: 16,
        width: '100%',
        maxWidth: 320,
        justifyContent: 'space-between',
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 6,
        borderRadius: 12, // Consistent border radius for button wrapper
        overflow: 'hidden',
        shadowColor: colors.shadow, // Add shadow to buttons
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    button: {
        paddingVertical: 14, // Consistent padding
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonWrapper: {
        // No gradient for close button, so direct background color
        backgroundColor: colors.border, // Neutral background for close button
    },
    closeButton: {
        backgroundColor: colors.border, // Ensure the inner view also has the background
    },
    buttonText: {
        fontWeight: '600',
        color: '#FFF', // White text for buttons
        fontSize: 16,
    },
});
