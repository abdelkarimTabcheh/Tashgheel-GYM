import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Color theme matching your design
const colors = {
  background: '#121212', // A slightly darker background for better contrast
  card: '#1e1e1e', // Darker card color
  text: '#ffffff',
  textSecondary: '#a5a5c2',
  highlight: '#8A56D6', // Using the purple from your gradient as a highlight
  accent: '#ff8a5d', // Keeping the orange accent
  error: '#ff6b6b',
  success: '#51cf66',
};

// Custom Alert Modal component since RN Alert is not ideal in web-based contexts
const CustomAlert = ({ visible, title, message, onCancel, onConfirm }) => {
  if (!visible) return null;
  return (
    <View style={styles.alertOverlay}>
      <View style={styles.alertBox}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
        <View style={styles.alertButtonContainer}>
          <TouchableOpacity style={styles.alertCancelButton} onPress={onCancel}>
            <Text style={styles.alertCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.alertConfirmButton} onPress={onConfirm}>
            <Text style={styles.alertConfirmButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


function ChatBotScreen() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: '💪 Welcome to FitBot! I\'m your personal fitness and nutrition expert. Whether you need workout routines, meal plans, or healthy lifestyle tips, I\'m here to help you reach your fitness goals! What would you like to know?',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const scrollViewRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setLoading(true);

    try {
      // API call to Hugging Face
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `You are FitBot, a certified fitness and nutrition expert. You provide evidence-based advice on workouts, meal planning, supplements, and healthy lifestyle habits. Always prioritize safety and recommend consulting healthcare professionals for medical concerns. Keep responses helpful, motivational, and practical.

User: ${currentInput}
FitBot:`,
          parameters: {
            max_new_tokens: 120,
            temperature: 0.7,
            repetition_penalty: 1.1,
            do_sample: true,
          }
        }),
      });

      let botReply = '';

      if (!response.ok) {
        if (response.status === 503) {
          botReply = "I'm currently loading. Let me try to help you in another way: " + generateFallbackResponse(currentInput);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } else {
        const data = await response.json();

        if (Array.isArray(data) && data[0]?.generated_text) {
          botReply = data[0].generated_text.replace(currentInput, '').trim();
        } else if (data.generated_text) {
          botReply = data.generated_text.replace(currentInput, '').trim();
        } else if (data.error) {
          botReply = "I'm currently processing other requests. Here's what I can tell you: " + generateFallbackResponse(currentInput);
        } else {
          botReply = generateFallbackResponse(currentInput);
        }

        // Clean up the response
        if (!botReply || botReply === currentInput || botReply.length < 2) {
          botReply = generateFallbackResponse(currentInput);
        }
      }

      setMessages(prev => [...prev, {
        role: 'bot',
        content: botReply,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsOnline(true);

    } catch (error) {
      console.error('Error:', error);
      setIsOnline(false);
      const fallbackReply = generateFallbackResponse(currentInput);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `${fallbackReply}\n\n(Note: Running in offline mode)`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
    }

    setLoading(false);
  };

  const generateFallbackResponse = (input) => {
    const lowerInput = input.toLowerCase();

    // Fitness-related greetings
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello there, fitness enthusiast! 💪 I'm FitBot, your personal trainer and nutrition expert. Ready to crush your fitness goals together? What can I help you with today?";
    }

    // Workout requests
    if (lowerInput.includes('workout') || lowerInput.includes('exercise') || lowerInput.includes('training')) {
      const workouts = [
        "Great question about workouts! For beginners, I recommend starting with 3 full-body sessions per week: squats, push-ups, planks, and walking. What's your current fitness level?",
        "Effective workouts depend on your goals! Are you looking to build muscle, lose weight, or improve endurance? I can create a personalized plan for you!",
        "Love the motivation! A solid workout includes: 5-min warm-up, 20-30min strength training, 10-15min cardio, and 5-min cool-down. What type of exercises do you enjoy?",
        "For maximum results, consistency beats intensity! Start with 3-4 workouts per week, focusing on compound movements like squats, deadlifts, and push-ups. Need a specific routine?"
      ];
      return workouts[Math.floor(Math.random() * workouts.length)];
    }

    // Diet and nutrition
    if (lowerInput.includes('diet') || lowerInput.includes('nutrition') || lowerInput.includes('food') || lowerInput.includes('meal')) {
      const nutrition = [
        "Nutrition is 70% of your fitness journey! Focus on whole foods: lean proteins, complex carbs, healthy fats, and lots of vegetables. What are your current eating habits?",
        "For optimal results: eat protein with every meal, stay hydrated (8+ glasses water daily), and time your carbs around workouts. What's your main nutrition goal?",
        "Meal planning is key! Try prepping proteins, vegetables, and grains in bulk. A balanced plate: 1/2 vegetables, 1/4 lean protein, 1/4 complex carbs. Need recipe ideas?",
        "Remember: no food is 'bad' - it's about balance! Focus on the 80/20 rule: eat nutritiously 80% of the time. What specific nutrition questions do you have?"
      ];
      return nutrition[Math.floor(Math.random() * nutrition.length)];
    }

    // Weight loss
    if (lowerInput.includes('weight loss') || lowerInput.includes('lose weight') || lowerInput.includes('fat loss')) {
      return "Weight loss = calories in < calories out! But let's do it healthily: combine strength training, cardio, and a balanced diet. Aim for 1-2lbs per week. What's your current approach?";
    }

    // Muscle building
    if (lowerInput.includes('muscle') || lowerInput.includes('gain') || lowerInput.includes('bulk')) {
      return "Building muscle requires: progressive overload in training, adequate protein (0.7-1g per lb bodyweight), sufficient calories, and 7-9 hours sleep. What's your training experience?";
    }

    // Supplements
    if (lowerInput.includes('supplement') || lowerInput.includes('protein powder') || lowerInput.includes('creatine')) {
      return "Supplements complement, not replace, good nutrition! The basics: whey protein (if needed), creatine monohydrate, vitamin D, and omega-3s. Food first though! What are you considering?";
    }

    // Motivation and goals
    if (lowerInput.includes('motivation') || lowerInput.includes('goal') || lowerInput.includes('start')) {
      return "Every fitness journey starts with a single step! Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound. You've got this! 💪 What's your main fitness goal?";
    }

    // Help requests
    if (lowerInput.includes('help') || lowerInput.includes('assist')) {
      return "I'm here to help you transform your health! I can assist with: workout routines, meal planning, nutrition advice, supplement guidance, and motivation. What area interests you most?";
    }

    // Gratitude
    if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
      return "You're absolutely welcome! Remember, consistency is key - small daily actions lead to big results. Keep pushing forward! 💪 Any other fitness questions?";
    }

    // About FitBot
    if (lowerInput.includes('what are you') || lowerInput.includes('who are you')) {
      return "I'm FitBot, your AI-powered fitness and nutrition expert! I'm here 24/7 to provide evidence-based advice on workouts, meal planning, and healthy living. Think of me as your pocket personal trainer! 💪";
    }

    // Injury/pain related
    if (lowerInput.includes('pain') || lowerInput.includes('injury') || lowerInput.includes('hurt')) {
      return "⚠️ For any pain or injury concerns, please consult a healthcare professional or physiotherapist first. I can help with general fitness advice, but your safety comes first! Stay healthy! 🏥";
    }

    // Cardio
    if (lowerInput.includes('cardio') || lowerInput.includes('running') || lowerInput.includes('walking')) {
      return "Cardio is fantastic for heart health! Mix it up: steady-state (jogging, cycling) and HIIT (high-intensity intervals). Start with 20-30 min, 3x per week. What cardio activities do you enjoy?";
    }

    // Default fitness responses
    const fitnessResponses = [
      "That's a great fitness question! Every journey is unique. What specific aspect would you like to dive deeper into - training, nutrition, or lifestyle?",
      "I love your enthusiasm for health and fitness! Let's break this down step by step. What's your current fitness level and main goal?",
      "Excellent topic! In fitness, consistency trumps perfection every time. How can I help you stay on track with your health goals?",
      "That's definitely worth exploring! Remember, sustainable changes beat quick fixes. What would be most helpful for your fitness journey right now?",
      "Great question! The best fitness plan is one you can stick to long-term. What type of activities do you actually enjoy doing?",
      "I appreciate you asking about that! Success in fitness comes from combining smart training, proper nutrition, and adequate recovery. Which area needs the most attention?",
      "That's an important consideration for your health journey! Let's focus on evidence-based strategies. What specific results are you hoping to achieve?",
      "Fantastic that you're prioritizing your health! Small, consistent steps lead to amazing transformations. How can I support your fitness goals today? 💪"
    ];

    return fitnessResponses[Math.floor(Math.random() * fitnessResponses.length)];
  };

  const handleClearChat = () => {
    setIsAlertVisible(true);
  };

  const confirmClearChat = () => {
    setMessages([{
      role: 'bot',
      content: '💪 New session started! I\'m FitBot, ready to help you achieve your fitness goals. What would you like to work on today?',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }]);
    setIsAlertVisible(false);
  };

  const cancelClearChat = () => {
    setIsAlertVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>💪 FitBot - Fitness Expert</Text>
          <Text style={styles.headerSubtitle}>
            {isOnline ? '🟢 Ready to help with fitness & nutrition' : '🔴 Offline Mode - Basic fitness tips available'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearChat}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView
        style={styles.chatBox}
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageContainer}>
            <View
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userMsgBubble : styles.botMsgBubble,
              ]}
            >
              <View style={styles.messageHeader}>
                <Text style={[
                  styles.roleLabel,
                  msg.role === 'user' ? styles.userRole : styles.botRole
                ]}>
                  {msg.role === 'user' ? '🏃‍♀️ You' : '💪 FitBot'}
                </Text>
                <Text style={styles.timestamp}>{msg.timestamp}</Text>
              </View>
              <Text
                style={[
                  styles.messageText,
                  msg.role === 'user' ? styles.userMsgText : styles.botMsgText
                ]}
              >
                {msg.content}
              </Text>
            </View>
          </View>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.messageContainer}>
            <View style={[styles.messageBubble, styles.botMsgBubble]}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.highlight} />
                <Text style={styles.loadingText}>FitBot is analyzing...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Ask about workouts, nutrition, meal plans..."
            placeholderTextColor={colors.textSecondary}
            editable={!loading}
            multiline={true}
            textAlignVertical="center"
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!userInput.trim() || loading) && styles.disabledButton
            ]}
            onPress={sendMessage}
            disabled={!userInput.trim() || loading}
          >
            <Text style={styles.sendButtonText}>
              {loading ? '⏳' : '▶️'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.inputHint}>
          💪 Your AI Fitness Coach • {messages.length - 1} questions answered
        </Text>
      </View>
      <CustomAlert
        visible={isAlertVisible}
        title="Clear Chat"
        message="Are you sure you want to clear all messages? This action cannot be undone."
        onCancel={cancelClearChat}
        onConfirm={confirmClearChat}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.highlight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  clearButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  clearButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatBox: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContentContainer: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    maxWidth: '85%',
  },
  userMsgBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.highlight,
    marginLeft: '15%',
    borderBottomRightRadius: 5, // A subtle style change for a modern feel
  },
  botMsgBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.highlight,
    marginRight: '15%',
    borderBottomLeftRadius: 5, // A subtle style change for a modern feel
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  userRole: {
    color: colors.text,
  },
  botRole: {
    color: colors.highlight,
  },
  timestamp: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMsgText: {
    color: colors.text,
  },
  botMsgText: {
    color: colors.text,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: colors.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
    maxHeight: 120, // Allow for more lines of text
    minHeight: 50, // Set a minimum height
    textAlignVertical: 'center',
  },
  sendButton: {
    backgroundColor: colors.highlight,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.highlight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 20,
  },
  inputHint: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  // Custom Alert styles
  alertOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.highlight,
    shadowColor: colors.highlight,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  alertCancelButton: {
    flex: 1,
    backgroundColor: colors.textSecondary,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  alertConfirmButton: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  alertCancelButtonText: {
    color: colors.card,
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertConfirmButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <ChatBotScreen />
    </View>
  );
}
