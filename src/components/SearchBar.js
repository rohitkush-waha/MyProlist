import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  const handleClear = () => onChange('');

  return (
    <View style={styles.searchBox}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        autoCapitalize="none"
      />

      {value?.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={styles.clearText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },

  clearButton: {
    marginLeft: 8,
    padding: 6,
  },

  clearText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
  },
});
