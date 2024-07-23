import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import dbManager from '../Database/database';

// Default photo URL
const defaultPhotoUrl = 'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg';

const AddContactScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [landlineNumber, setLandlineNumber] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', clearFields);
    return unsubscribe;
  }, [navigation]);

  const clearFields = () => {
    setName('');
    setMobileNumber('');
    setLandlineNumber('');
    setIsFavorite(false);
    setSelectedImage(null);
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        const imageUri = response.uri || response.assets?.[0]?.uri || '';
        setSelectedImage(imageUri);
      }
    });
  };

  const handleSave = () => {
    if (!name.trim() || !mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter name and mobile number');
      return;
    }

    const contact = {
      name,
      mobileNumber,
      landlineNumber,
      photoUrl: selectedImage || defaultPhotoUrl,
      isFavorite,
    };

    dbManager.insertContact(contact)
      .then((success) => {
        if (success) {
          console.log("Contact inserted successfully!");
          navigation.navigate('ContactList');
        } else {
          console.log("Error: Contact insertion was not successful!");
        }
      })
      .catch(error => {
        console.error('Error inserting contact:', error);
      });

    navigation.goBack();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Contact</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <Icon name={isFavorite ? 'star' : 'star-o'} size={30} color={isFavorite ? 'gold' : '#ccc'} />
        </TouchableOpacity>
      </View>
      <View style={styles.photoContainer}>
        <View style={styles.photoWrapper}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            <TouchableOpacity style={styles.addPhotoButton} onPress={openImagePicker}>
              <Icon name="camera" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.input}
          value={mobileNumber}
          onChangeText={setMobileNumber}
          placeholder="Mobile Number"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={landlineNumber}
          onChangeText={setLandlineNumber}
          placeholder="Landline Number"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddContactScreen;
