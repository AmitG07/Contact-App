import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome';

const ContactItem = ({ contact, onUpdate, onDelete, onDetails }) => {
  return (
    <SwipeListView
      data={[contact]}
      renderHiddenItem={() => (
        <View style={styles.hiddenContainer}>
          <TouchableOpacity onPress={onUpdate} style={[styles.hiddenButton, styles.editButton]}>
            <Icon name="pencil" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={[styles.hiddenButton, styles.deleteButton]}>
            <Icon name="trash" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Image source={{ uri: item.photo }} style={styles.avatar} />
          <Text style={styles.name} onPress={onDetails} >{item.name}</Text>
        </View>
      )}
      keyExtractor={item => item.id.toString()}
      disableRightSwipe={true}
      rightOpenValue={-150} // Adjust as needed
    />
  );
};

const styles = StyleSheet.create({
  hiddenContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  hiddenButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: '100%',
  },
  editButton: {
    backgroundColor: 'blue',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
  },
});

export default ContactItem;
