const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersFile = path.join(__dirname, '../data/users.json');

// Initialize users file if it doesn't exist
if (!fs.existsSync(usersFile)) {
  const initialUsers = [
    {
      id: '1',
      email: 'admin@pharmacyfinder.com',
      password: bcrypt.hashSync('admin123', 10),
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      email: 'manager@cvs.com',
      password: bcrypt.hashSync('manager123', 10),
      name: 'CVS Manager',
      role: 'pharmacy_manager',
      pharmacyId: '1',
      createdAt: new Date().toISOString()
    }
  ];
  
  fs.writeFileSync(usersFile, JSON.stringify(initialUsers, null, 2));
}

const getUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

const findUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

const createUser = (userData) => {
  const users = getUsers();
  const newUser = {
    id: (users.length + 1).toString(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

const updateUser = (id, updates) => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
  saveUsers(users);
  return users[index];
};

module.exports = {
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser
};