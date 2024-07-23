import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import dbManager from '../Database/database';

const ContactDetailsScreen = ({ route, navigation }) => {
  const { contact } = route.params;

  const handleDeleteContact = async () => {
    try {
      await dbManager.deleteContact(contact.id);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contact Details</Text>
        <View style={styles.hiddenContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('UpdateContact', { contact })} style={[styles.hiddenButton, styles.editButton]}>
            <Icon name="pencil" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteContact} style={[styles.hiddenButton, styles.deleteButton]}>
            <Icon name="trash" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Image source={{ uri: contact.photo }} style={styles.photo} />
      <View style={styles.detailsContainer}>
        <DetailItem title="Name" value={contact.name} />
        <DetailItem title="Mobile Number" value={contact.mobile_number} />
        <DetailItem title="Landline Number" value={contact.landline_number} />
      </View>
    </View>
  );
};

const DetailItem = ({ title, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailTitle}>{title}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  hiddenContainer: {
    flexDirection: 'row',
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 70,
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
  },
  hiddenButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: 'blue',
  },
  deleteButton: {
    backgroundColor: 'red',
  }
});

export default ContactDetailsScreen;
