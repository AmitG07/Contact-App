import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import dbManager from '../Database/database';

const UpdateContactScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const [name, setName] = useState(contact.name);
  const [mobileNumber, setMobileNumber] = useState(contact.mobile_number);
  const [landlineNumber, setLandlineNumber] = useState(contact.landline_Number);
  const [photoUrl, setPhotoUrl] = useState(contact.photo);
  const [isFavorite, setIsFavorite] = useState(contact.is_Favorite);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setSelectedImage(photoUrl);
  }, [photoUrl]);

  useEffect(() => {
    setName(contact.name);
    setMobileNumber(contact.mobile_number);
    setLandlineNumber(contact.landline_Number);
    setPhotoUrl(contact.photo);
    setSelectedImage(contact.photo);
  }, [contact]);

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri || '';
        setSelectedImage(imageUri);
        setPhotoUrl(imageUri);
      }
    });
  };

  const handleUpdate = () => {
    if (!name.trim() || !mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter name and mobile number');
      return;
    }

    const updatedContact = {
      id: contact.id,
      name: name,
      mobileNumber: mobileNumber,
      landlineNumber: landlineNumber,
      photoUrl: photoUrl,
      isFavorite: isFavorite,
    };

    dbManager
      .updateContact(updatedContact)
      .then(success => {
        if (success) {
          console.log('Contact updated successfully!');
          navigation.navigate('ContactList');
        } else {
          console.log('Error updating contact!');
        }
      })
      .catch(error => {
        console.error('Error updating contact:', error);
      });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleDelete = () => {
    dbManager
      .deleteContact(contact.id)
      .then(success => {
        if (success) {
          console.log('Contact deleted successfully!');
          navigation.navigate('ContactList');
        } else {
          console.log('Error deleting contact!');
        }
      })
      .catch(error => {
        console.error('Error deleting contact:', error);
      });
  };

  const handleEditPhoto = () => {
    openImagePicker();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Update Contact</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <Icon name={isFavorite ? 'star' : 'star-o'} size={30} color={isFavorite ? 'gold' : '#ccc'} />
        </TouchableOpacity>
      </View>
      <View style={styles.photoContainer}>
        <View style={styles.photoWrapper}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage || defaultPhotoUrl }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={openImagePicker}>
              <Icon name="camera" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          {selectedImage && (
            <TouchableOpacity
              style={styles.editPhotoIcon}
              onPress={handleEditPhoto}>
              <Icon name="edit" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

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
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    textAlign: 'center',
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
    position: 'relative',
  },
  photoWrapper: {
    width: 130,
    height: 130,
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
  editPhotoIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'orange',
    borderRadius: 10,
    padding: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'navy',
  },
});

export default UpdateContactScreen;
