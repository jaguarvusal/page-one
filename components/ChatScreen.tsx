import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  isSender: boolean;
}

interface ChatScreenProps {
  senderName: string;
  onBack: () => void;
  userType: 'producer' | 'writer';
}

export default function ChatScreen({ senderName, onBack, userType }: ChatScreenProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: userType === 'producer' 
        ? 'Hi! I really enjoyed your script "The Midnight Train". Would you be interested in discussing it further?' 
        : 'Thank you for your interest in my script! I\'d love to discuss it further.',
      isSender: userType === 'producer',
    },
    {
      id: '2',
      text: userType === 'producer'
        ? 'I think it has great potential for adaptation. Would you be open to some revisions?'
        : 'I\'m definitely open to revisions. What specific changes were you thinking about?',
      isSender: userType === 'producer',
    },
    {
      id: '3',
      text: userType === 'producer'
        ? 'I\'d like to focus on strengthening the protagonist\'s backstory and adding more tension in the second act.'
        : 'That sounds interesting. I have some ideas for the backstory that could tie into the main conflict.',
      isSender: userType === 'producer',
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: message,
          isSender: true,
        },
      ]);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ThemedView style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>{senderName}</ThemedText>
      </ThemedView>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg) => (
          <ThemedView
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isSender ? styles.senderBubble : styles.receiverBubble,
            ]}
          >
            <ThemedText
              style={[
                styles.messageText,
                msg.isSender ? styles.senderText : styles.receiverText,
              ]}
            >
              {msg.text}
            </ThemedText>
          </ThemedView>
        ))}
      </ScrollView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666666"
          multiline
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <FontAwesome name="paper-plane" size={24} color="#000000" />
        </Pressable>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'CourierPrime',
    color: '#000000',
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  senderBubble: {
    backgroundColor: '#000000',
    alignSelf: 'flex-end',
  },
  receiverBubble: {
    backgroundColor: '#F5F5DC',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#000000',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
  },
  senderText: {
    color: '#FFFFFF',
  },
  receiverText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#000000',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontFamily: 'CourierPrime',
    color: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
}); 