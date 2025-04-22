import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function MoreScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.profileSection}>
        <ThemedText style={styles.sectionTitle}>Profile</ThemedText>
        <ThemedView style={styles.profileCard}>
          <ThemedText style={styles.name}>John Writer</ThemedText>
          <ThemedText style={styles.bio}>
            Screenwriter specializing in psychological thrillers and character-driven dramas. 
            Currently working on a feature-length script about time travel and human connection.
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.settingsSection}>
        <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
        <ThemedView style={styles.settingsList}>
          <Pressable style={styles.settingItem}>
            <ThemedText style={styles.settingText}>Change Password</ThemedText>
            <ThemedText style={styles.arrow}>→</ThemedText>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <ThemedText style={styles.settingText}>Notification Preferences</ThemedText>
            <ThemedText style={styles.arrow}>→</ThemedText>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <ThemedText style={styles.settingText}>Privacy Settings</ThemedText>
            <ThemedText style={styles.arrow}>→</ThemedText>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <ThemedText style={styles.settingText}>Account Information</ThemedText>
            <ThemedText style={styles.arrow}>→</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileSection: {
    padding: 16,
  },
  settingsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'CourierPrime',
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#000000',
  },
  name: {
    fontSize: 24,
    fontFamily: 'CourierPrime',
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
    color: '#000000',
    lineHeight: 24,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
    color: '#000000',
  },
  arrow: {
    fontSize: 20,
    fontFamily: 'CourierPrime',
    color: '#000000',
  },
}); 