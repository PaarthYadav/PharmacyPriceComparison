const fs = require('fs');
const path = require('path');

const medicationsFile = path.join(__dirname, '../data/medications.json');

// Initialize with sample data
if (!fs.existsSync(medicationsFile)) {
  const sampleMedications = [
    {
      id: '1',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      category: 'ACE Inhibitor',
      description: 'Used to treat high blood pressure and heart failure',
      dosage: '10mg',
      manufacturer: 'Generic'
    },
    {
      id: '2',
      name: 'Metformin',
      genericName: 'Metformin HCl',
      category: 'Antidiabetic',
      description: 'Used to treat type 2 diabetes',
      dosage: '500mg',
      manufacturer: 'Teva'
    },
    {
      id: '3',
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      category: 'Statin',
      description: 'Used to lower cholesterol',
      dosage: '20mg',
      manufacturer: 'Pfizer'
    },
    {
      id: '4',
      name: 'Omeprazole',
      genericName: 'Omeprazole',
      category: 'Proton Pump Inhibitor',
      description: 'Used to treat acid reflux and heartburn',
      dosage: '20mg',
      manufacturer: 'Dr. Reddy\'s'
    },
    {
      id: '5',
      name: 'Hydrochlorothiazide',
      genericName: 'HCTZ',
      category: 'Diuretic',
      description: 'Used to treat high blood pressure',
      dosage: '25mg',
      manufacturer: 'Mylan'
    }
  ];
  
  fs.writeFileSync(medicationsFile, JSON.stringify(sampleMedications, null, 2));
}

const getMedications = () => {
  try {
    return JSON.parse(fs.readFileSync(medicationsFile, 'utf8'));
  } catch (error) {
    console.error('Error reading medications file:', error);
    return [];
  }
};

const saveMedications = (medications) => {
  try {
    fs.writeFileSync(medicationsFile, JSON.stringify(medications, null, 2));
  } catch (error) {
    console.error('Error saving medications:', error);
  }
};

const findMedicationById = (id) => {
  const medications = getMedications();
  return medications.find(med => med.id === id);
};

const searchMedications = (query, filters = {}) => {
  let medications = getMedications();
  
  // Text search
  if (query) {
    const searchTerm = query.toLowerCase();
    medications = medications.filter(med => 
      med.name.toLowerCase().includes(searchTerm) ||
      med.genericName.toLowerCase().includes(searchTerm) ||
      med.category.toLowerCase().includes(searchTerm)
    );
  }
  
  // Category filter
  if (filters.category) {
    medications = medications.filter(med => 
      med.category.toLowerCase() === filters.category.toLowerCase()
    );
  }
  
  return medications;
};

const createMedication = (medicationData) => {
  const medications = getMedications();
  const newMedication = {
    id: (medications.length + 1).toString(),
    ...medicationData
  };
  
  medications.push(newMedication);
  saveMedications(medications);
  return newMedication;
};

module.exports = {
  getMedications,
  findMedicationById,
  searchMedications,
  createMedication
};