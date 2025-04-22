import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatsCard } from '@/components/StatsCard';

export default function StatsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Your Stats</ThemedText>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <StatsCard 
          title="Total Snippets" 
          value="12" 
          icon="📝" 
        />
        <StatsCard 
          title="Shortlisted Snippets" 
          value="7" 
          icon="⭐" 
        />
        <StatsCard 
          title="Active Matches" 
          value="3" 
          icon="🤝" 
        />
        <StatsCard 
          title="Unread Messages" 
          value="5" 
          icon="✉️" 
        />
        <StatsCard 
          title="Profile Views" 
          value="42" 
          icon="👁️" 
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontFamily: 'CourierPrime',
    color: '#000000',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
}); 