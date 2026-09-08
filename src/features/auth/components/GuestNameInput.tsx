import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { ArrowRight, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface GuestNameInputProps {
  onSubmit: (name: string) => void;
  disabled?: boolean;
}

export function GuestNameInput({ onSubmit, disabled = false }: GuestNameInputProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    setError(null);
    onSubmit(trimmed);
  };

  const hasContent = name.trim().length > 0;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          error ? styles.inputWrapperError : null,
          disabled ? styles.inputWrapperDisabled : null,
        ]}
      >
        <User size={18} color="#8c7c6c" style={styles.leadingIcon} />
        <TextInput
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) setError(null);
          }}
          placeholder="Enter your name to explore..."
          placeholderTextColor="#a89a8b"
          style={styles.input}
          maxLength={30}
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
          editable={!disabled}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={disabled || !hasContent}
          activeOpacity={0.8}
          style={[
            styles.circleBtn,
            (!hasContent || disabled) && styles.circleBtnDisabled,
          ]}
        >
          <ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e5dec9',
    borderRadius: 28,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 5,
    shadowColor: '#27170c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: '#dc2626',
  },
  inputWrapperDisabled: {
    opacity: 0.65,
  },
  leadingIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#27170c',
    fontFamily: 'Plus Jakarta Sans',
    paddingVertical: 8,
    paddingRight: 8,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#566434',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#566434',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  circleBtnDisabled: {
    backgroundColor: '#c4b8aa',
    shadowOpacity: 0,
    elevation: 0,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    fontFamily: 'Plus Jakarta Sans',
    marginTop: 4,
    marginLeft: 16,
  },
});
