import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const SearchBar = ({ onChangeText, value }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor="#A9A9A9"
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;
