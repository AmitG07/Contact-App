import SQLite from 'react-native-sqlite-storage';

export class Database {
  constructor() {
    this.database_name = "ContactManager.db";
    this.db = null;
    this.initialiseDatabase();
  }

  initialiseDatabase = async () => {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);
  
    try {
      console.log('Initialise Database');
      this.db = await SQLite.openDatabase({ name: this.database_name, location: 'default' });
  
      await this.db.transaction(async (tx) => {
        await tx.executeSql(`
          CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY,
            name TEXT,
            mobile_number TEXT,
            landline_number TEXT,
            photo BLOB,
            is_Favorite INTEGER DEFAULT 0
          );
        `);
      });
  
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };  

  insertContact = async (contact) => {
    try {
      await this.db.executeSql(
        'INSERT INTO contacts (name, mobile_number, landline_number, photo, is_Favorite) VALUES (?, ?, ?, ?, ?)',
        [contact.name, contact.mobileNumber, contact.landlineNumber, contact.photoUrl, contact.isFavorite ? 1 : 0]
      );
      console.log('Contact inserted successfully');
    } catch (error) {
      console.error('Error inserting contact:', error);
    }
  };

  getContacts = async () => {
    try {
      const results = await this.db.executeSql('SELECT * FROM contacts ORDER BY name ASC');
      console.log('Contacts:', results[0].rows.raw());
      return results[0].rows.raw();
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  };

  searchContacts = async (query) => {
    try {
      const results = await this.db.executeSql(
        `SELECT * FROM contacts WHERE name LIKE '%${query}%' ORDER BY name ASC`
      );
      return results[0].rows.raw();
    } catch (error) {
      console.error('Error searching contacts:', error);
      return [];
    }
  };

  getFavoriteContacts = async () => {
    try {
      const results = await this.db.executeSql('SELECT * FROM contacts WHERE is_Favorite = 1 ORDER BY name ASC');
      return results[0].rows.raw();
    } catch (error) {
      console.error('Error fetching favorite contacts:', error);
      return [];
    }
  };

  updateContact = async (contact) => {
    try {
      await this.db.executeSql(
        'UPDATE contacts SET name = ?, mobile_number = ?, landline_number = ?, photo = ?, is_Favorite = ? WHERE id = ?',
        [contact.name, contact.mobileNumber, contact.landlineNumber, contact.photoUrl, contact.isFavorite ? 1 : 0, contact.id]
      );
      console.log('Contact updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating contact:', error);
      return false;
    }
  };

  deleteContact = async (id) => {
    try {
      await this.db.executeSql('DELETE FROM contacts WHERE id = ?', [id]);
      console.log('Contact deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      return false;
    }
  };
}

const dbManager = new Database();
export default dbManager;
