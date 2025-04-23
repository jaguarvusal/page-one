import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { auth, db } from '@/firebase';
import { collection, query, where, getDocs } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export default function WriterLayout() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const messagesQuery = query(
        collection(db, 'messages'),
        where('receiverId', '==', user.uid),
        where('isRead', '==', false)
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      setUnreadCount(messagesSnapshot.size);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5E5',
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#666666',
        headerShown: false,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontFamily: 'CourierPrime',
        },
        headerTintColor: '#000000',
        headerShadowVisible: false,
        headerStatusBarHeight: Platform.OS === 'ios' ? 40 : 0,
      }}
    >
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bar-chart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="snippets"
        options={{
          title: 'Snippets',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="file-text-o" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => (
            <ThemedView>
              <FontAwesome name="envelope-o" size={24} color={color} />
              {unreadCount > 0 && (
                <ThemedView style={styles.badge}>
                  <ThemedText style={styles.badgeText}>
                    {unreadCount}
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="ellipsis-h" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = {
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
}; 