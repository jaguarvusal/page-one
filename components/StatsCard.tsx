import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <ThemedText style={styles.icon}>{icon}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#000000',
  },
  title: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
    color: '#666666',
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontFamily: 'CourierPrime',
    color: '#000000',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    fontFamily: 'CourierPrime',
    color: '#000000',
    position: 'absolute',
    right: 20,
    top: 20,
  },
}); 