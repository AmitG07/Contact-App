import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import ContactItem from '../Components/ContactItem';
import SearchBar from '../Components/SearchBar';
import dbManager from '../Database/database';
import Icon from 'react-native-vector-icons/FontAwesome';

const ContactListScreen = ({navigation}) => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchContacts();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchContacts = async () => {
    console.log('Fetching contacts...');
    setLoading(true);
    try {
      const fetchedContacts = await dbManager.getContacts();
      setContacts(fetchedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async text => {
    setSearchQuery(text);
    try {
      if (text === '') {
        fetchContacts();
      } else {
        const searchedContacts = await dbManager.searchContacts(text);
        setContacts(searchedContacts);
      }
    } catch (error) {
      console.error('Error searching contacts:', error);
    }
  };

  const handleDeleteContact = async contactId => {
    try {
      await dbManager.deleteContact(contactId);
      setContacts(prevContacts =>
        prevContacts.filter(contact => contact.id !== contactId),
      );
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const refreshContacts = () => {
    fetchContacts();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar onChangeText={handleSearch} value={searchQuery} />
      </View>
      {loading && <Text>Loading...</Text>}
      {!loading && contacts.length === 0 && <Text>No contacts available</Text>}
      {contacts.length > 0 && (
        <FlatList
          data={contacts}
          renderItem={({item}) => (
            <ContactItem
              contact={item}
              onDetails={() => navigation.navigate('ContactDetails', { contact: item })}
              onUpdate={() => navigation.navigate('UpdateContact', { contact: item })}
              onDelete={() => handleDeleteContact(item.id)}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate('AddContact');
          navigation.setOptions({
            params: {refreshContacts: refreshContacts},
          });
        }}>
        <Icon name="plus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactListScreen;
