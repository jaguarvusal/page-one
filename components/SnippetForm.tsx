import { StyleSheet, TextInput, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface SnippetFormProps {
  title: string;
  genre: string;
  synopsis: string;
  onTitleChange: (text: string) => void;
  onGenreChange: (text: string) => void;
  onSynopsisChange: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function SnippetForm({
  title,
  genre,
  synopsis,
  onTitleChange,
  onGenreChange,
  onSynopsisChange,
  onSubmit,
  onCancel,
  isEditing,
}: SnippetFormProps) {
  return (
    <ThemedView style={styles.form}>
      <ThemedText style={styles.label}>Title</ThemedText>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={onTitleChange}
        placeholder="Enter snippet title"
        placeholderTextColor="#999999"
      />
      
      <ThemedText style={styles.label}>Genre</ThemedText>
      <TextInput
        style={styles.input}
        value={genre}
        onChangeText={onGenreChange}
        placeholder="Enter genre"
        placeholderTextColor="#999999"
      />
      
      <ThemedText style={styles.label}>Synopsis</ThemedText>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={synopsis}
        onChangeText={onSynopsisChange}
        placeholder="Enter synopsis"
        placeholderTextColor="#999999"
        multiline
        numberOfLines={4}
      />
      
      <ThemedView style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <ThemedText style={styles.buttonText}>Cancel</ThemedText>
        </Pressable>
        <Pressable style={[styles.button, styles.submitButton]} onPress={onSubmit}>
          <ThemedText style={[styles.buttonText, styles.submitButtonText]}>
            {isEditing ? 'Update' : 'Add'} Snippet
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  form: {
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
  label: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'CourierPrime',
    color: '#000000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
  },
  submitButton: {
    backgroundColor: '#000000',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
  },
  submitButtonText: {
    color: '#FFFFFF',
  },
}); 