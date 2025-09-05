const fs = require('fs');
const path = require('path');

const pharmaciesFile = path.join(__dirname, '../data/pharmacies.json');

// Initialize with sample data
if (!fs.existsSync(pharmaciesFile)) {
  const samplePharmacies = [
    {
      id: '1',
      name: 'CVS Pharmacy',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '(555) 123-4567',
      email: 'store123@cvs.com',
      hours: {
        monday: '8:00 AM - 10:00 PM',
        tuesday: '8:00 AM - 10:00 PM',
        wednesday: '8:00 AM - 10:00 PM',
        thursday: '8:00 AM - 10:00 PM',
        friday: '8:00 AM - 10:00 PM',
        saturday: '9:00 AM - 9:00 PM',
        sunday: '10:00 AM - 8:00 PM'
      },
      rating: 4.2,
      totalReviews: 156
    },
    {
      id: '2',
      name: 'Walgreens',
      address: '456 Oak Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      phone: '(555) 234-5678',
      email: 'store456@walgreens.com',
      hours: {
        monday: '7:00 AM - 11:00 PM',
        tuesday: '7:00 AM - 11:00 PM',
        wednesday: '7:00 AM - 11:00 PM',
        thursday: '7:00 AM - 11:00 PM',
        friday: '7:00 AM - 11:00 PM',
        saturday: '8:00 AM - 10:00 PM',
        sunday: '9:00 AM - 9:00 PM'
      },
      rating: 4.5,
      totalReviews: 203
    },
    {
      id: '3',
      name: 'Rite Aid',
      address: '789 Pine St',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      phone: '(555) 345-6789',
      email: 'store789@riteaid.com',
      hours: {
        monday: '8:00 AM - 9:00 PM',
        tuesday: '8:00 AM - 9:00 PM',
        wednesday: '8:00 AM - 9:00 PM',
        thursday: '8:00 AM - 9:00 PM',
        friday: '8:00 AM - 9:00 PM',
        saturday: '9:00 AM - 8:00 PM',
        sunday: '10:00 AM - 6:00 PM'
      },
      rating: 3.9,
      totalReviews: 89
    },
    {
      id: '4',
      name: 'Duane Reade',
      address: '321 Broadway',
      city: 'New York',
      state: 'NY',
      zipCode: '10007',
      phone: '(555) 456-7890',
      email: 'store321@duanereade.com',
      hours: {
        monday: '24 Hours',
        tuesday: '24 Hours',
        wednesday: '24 Hours',
        thursday: '24 Hours',
        friday: '24 Hours',
        saturday: '24 Hours',
        sunday: '24 Hours'
      },
      rating: 4.1,
      totalReviews: 124
    }
  ];
  
  fs.writeFileSync(pharmaciesFile, JSON.stringify(samplePharmacies, null, 2));
}

const getPharmacies = () => {
  try {
    return JSON.parse(fs.readFileSync(pharmaciesFile, 'utf8'));
  } catch (error) {
    console.error('Error reading pharmacies file:', error);
    return [];
  }
};

const savePharmacies = (pharmacies) => {
  try {
    fs.writeFileSync(pharmaciesFile, JSON.stringify(pharmacies, null, 2));
  } catch (error) {
    console.error('Error saving pharmacies:', error);
  }
};

const findPharmacyById = (id) => {
  const pharmacies = getPharmacies();
  return pharmacies.find(pharmacy => pharmacy.id === id);
};

const createPharmacy = (pharmacyData) => {
  const pharmacies = getPharmacies();
  const newPharmacy = {
    id: (pharmacies.length + 1).toString(),
    ...pharmacyData,
    rating: 0,
    totalReviews: 0
  };
  
  pharmacies.push(newPharmacy);
  savePharmacies(pharmacies);
  return newPharmacy;
};

const updatePharmacy = (id, updates) => {
  const pharmacies = getPharmacies();
  const index = pharmacies.findIndex(pharmacy => pharmacy.id === id);
  
  if (index === -1) return null;
  
  pharmacies[index] = { ...pharmacies[index], ...updates };
  savePharmacies(pharmacies);
  return pharmacies[index];
};

module.exports = {
  getPharmacies,
  findPharmacyById,
  createPharmacy,
  updatePharmacy
};