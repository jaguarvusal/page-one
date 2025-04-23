import { StyleSheet, View, Pressable, Alert, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';

export default function MoreScreen() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.email}>
          {auth.currentUser?.email}
        </ThemedText>
        <Pressable 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <ThemedText style={styles.logoutText}>Log Out</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  email: {
    fontSize: 18,
    fontFamily: 'CourierPrime',
    color: '#000000',
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    width: '100%',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 