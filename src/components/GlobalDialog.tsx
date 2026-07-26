import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDialogStore } from '@/store/dialogStore';

export function GlobalDialog() {
  const { isVisible, options, hideDialog } = useDialogStore();

  if (!isVisible || !options) return null;

  return (
    <Modal transparent animationType="fade" visible={isVisible} onRequestClose={hideDialog}>
      <View style={styles.overlay}>
        <View style={styles.dialogBox}>
          <Text style={styles.title}>{options.title}</Text>
          {options.message ? <Text style={styles.message}>{options.message}</Text> : null}
          
          <View style={styles.buttonContainer}>
            {(options.buttons && options.buttons.length > 0) ? (
              options.buttons.map((btn, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    index > 0 && styles.buttonBorder,
                    btn.style === 'cancel' && styles.cancelButton
                  ]}
                  onPress={() => {
                    hideDialog();
                    if (btn.onPress) btn.onPress();
                  }}
                >
                  <Text style={[
                    styles.buttonText, 
                    btn.style === 'destructive' && styles.destructiveText,
                    btn.style === 'cancel' && styles.cancelText
                  ]}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity style={styles.button} onPress={hideDialog}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '80%',
    maxWidth: 340,
    paddingTop: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '700',
    color: '#27170c',
    marginBottom: 8,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: '#6b5d51',
    marginBottom: 24,
    paddingHorizontal: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eef1e4',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBorder: {
    borderLeftWidth: 1,
    borderColor: '#eef1e4',
  },
  buttonText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '600',
    color: '#566434',
  },
  cancelButton: {
    backgroundColor: '#fcfbf7',
    borderBottomLeftRadius: 20,
  },
  cancelText: {
    color: '#8c7c6c',
  },
  destructiveText: {
    color: '#d32f2f',
  }
});
