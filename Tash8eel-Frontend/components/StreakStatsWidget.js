import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const StreakStatsWidget = ({
    currentStreak = 0,
    longestStreak = 0,
    totalChallenges = 0,
    onPress,
    compact = false
}) => {
    if (compact) {
        return (
            <TouchableOpacity style={styles.compactContainer} onPress={onPress}>
                <View style={styles.compactStreak}>
                    <Text style={styles.compactEmoji}>🔥</Text>
                    <Text style={styles.compactNumber}>{currentStreak}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.statCard} onPress={onPress}>
                <Text style={styles.emoji}>🔥</Text>
                <Text style={styles.number}>{currentStreak}</Text>
                <Text style={styles.label}>Current Streak</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statCard} onPress={onPress}>
                <Text style={styles.emoji}>🏆</Text>
                <Text style={styles.number}>{longestStreak}</Text>
                <Text style={styles.label}>Best Streak</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statCard} onPress={onPress}>
                <Text style={styles.emoji}>✅</Text>
                <Text style={styles.number}>{totalChallenges}</Text>
                <Text style={styles.label}>Completed</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    compactStreak: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    compactEmoji: {
        fontSize: 16,
        marginRight: 4,
    },
    compactNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FF6B35',
    },
    statCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        margin: 8,
        alignItems: 'center',
        minWidth: 90,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    emoji: {
        fontSize: 24,
        marginBottom: 8,
    },
    number: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default StreakStatsWidget;
