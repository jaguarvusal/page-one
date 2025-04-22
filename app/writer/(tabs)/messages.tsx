import { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MessageCard } from '@/components/MessageCard';
import ChatScreen from '@/components/ChatScreen';

interface Message {
  id: string;
  senderName: string;
  preview: string;
  timestamp: string;
}

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState<Message | null>(null);
  const [messages] = useState<Message[]>([
    {
      id: '1',
      senderName: 'John Smith',
      preview: 'Hi! I really enjoyed your script "The Midnight Train"...',
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      senderName: 'Sarah Johnson',
      preview: 'Would you be interested in adapting your short story...',
      timestamp: 'Yesterday',
    },
    {
      id: '3',
      senderName: 'Michael Brown',
      preview: 'I read your latest draft and have some notes...',
      timestamp: '2 days ago',
    },
  ]);

  if (selectedChat) {
    return (
      <ChatScreen
        senderName={selectedChat.senderName}
        onBack={() => setSelectedChat(null)}
        userType="writer"
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Messages</ThemedText>
      <ScrollView style={styles.messagesList}>
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            senderName={message.senderName}
            preview={message.preview}
            timestamp={message.timestamp}
            onPress={() => setSelectedChat(message)}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontFamily: 'CourierPrime',
    color: '#000000',
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  messagesList: {
    flex: 1,
  },
}); 