import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import ContactItem from '../Components/ContactItem';
import dbManager from '../Database/database';

const FavoriteContactListScreen = ({ navigation }) => {
  const [favoriteContacts, setFavoriteContacts] = useState([]);

  useEffect(() => {
    fetchFavoriteContacts();
  }, []);

  const fetchFavoriteContacts = async () => {
    try {
      const fetchedFavoriteContacts = await dbManager.getFavoriteContacts();
      setFavoriteContacts(fetchedFavoriteContacts);
    } catch (error) {
      console.error('Error fetching favorite contacts:', error);
    }
  };

  return (
    <View>
      <FlatList
        data={favoriteContacts}
        renderItem={({ item }) => (
          <ContactItem
            contact={item}
            onPress={() => navigation.navigate('UpdateContact', { contact: item })}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = {
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
  },
};

export default FavoriteContactListScreen;