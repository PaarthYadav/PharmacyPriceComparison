const fs = require('fs');
const path = require('path');

const pricesFile = path.join(__dirname, '../data/prices.json');

// Initialize with sample price data
if (!fs.existsSync(pricesFile)) {
  const samplePrices = [
    // Lisinopril prices
    { id: '1', medicationId: '1', pharmacyId: '1', price: 12.99, stock: 150, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '2', medicationId: '1', pharmacyId: '2', price: 15.49, stock: 85, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '3', medicationId: '1', pharmacyId: '3', price: 11.25, stock: 200, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '4', medicationId: '1', pharmacyId: '4', price: 13.75, stock: 120, lastUpdated: new Date().toISOString(), isAvailable: true },
    
    // Metformin prices
    { id: '5', medicationId: '2', pharmacyId: '1', price: 8.99, stock: 300, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '6', medicationId: '2', pharmacyId: '2', price: 9.99, stock: 250, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '7', medicationId: '2', pharmacyId: '3', price: 7.50, stock: 180, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '8', medicationId: '2', pharmacyId: '4', price: 8.25, stock: 400, lastUpdated: new Date().toISOString(), isAvailable: true },
    
    // Atorvastatin prices
    { id: '9', medicationId: '3', pharmacyId: '1', price: 25.99, stock: 75, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '10', medicationId: '3', pharmacyId: '2', price: 28.49, stock: 60, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '11', medicationId: '3', pharmacyId: '3', price: 22.75, stock: 90, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '12', medicationId: '3', pharmacyId: '4', price: 24.99, stock: 110, lastUpdated: new Date().toISOString(), isAvailable: true },
    
    // Omeprazole prices
    { id: '13', medicationId: '4', pharmacyId: '1', price: 18.99, stock: 200, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '14', medicationId: '4', pharmacyId: '2', price: 16.49, stock: 150, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '15', medicationId: '4', pharmacyId: '3', price: 19.25, stock: 0, lastUpdated: new Date().toISOString(), isAvailable: false },
    { id: '16', medicationId: '4', pharmacyId: '4', price: 17.75, stock: 95, lastUpdated: new Date().toISOString(), isAvailable: true },
    
    // Hydrochlorothiazide prices
    { id: '17', medicationId: '5', pharmacyId: '1', price: 6.99, stock: 500, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '18', medicationId: '5', pharmacyId: '2', price: 7.99, stock: 350, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '19', medicationId: '5', pharmacyId: '3', price: 5.50, stock: 275, lastUpdated: new Date().toISOString(), isAvailable: true },
    { id: '20', medicationId: '5', pharmacyId: '4', price: 6.25, stock: 425, lastUpdated: new Date().toISOString(), isAvailable: true }
  ];
  
  fs.writeFileSync(pricesFile, JSON.stringify(samplePrices, null, 2));
}

const getPrices = () => {
  try {
    return JSON.parse(fs.readFileSync(pricesFile, 'utf8'));
  } catch (error) {
    console.error('Error reading prices file:', error);
    return [];
  }
};

const savePrices = (prices) => {
  try {
    fs.writeFileSync(pricesFile, JSON.stringify(prices, null, 2));
  } catch (error) {
    console.error('Error saving prices:', error);
  }
};

const findPricesByMedication = (medicationId) => {
  const prices = getPrices();
  return prices.filter(price => price.medicationId === medicationId);
};

const findPricesByPharmacy = (pharmacyId) => {
  const prices = getPrices();
  return prices.filter(price => price.pharmacyId === pharmacyId);
};

const updatePrice = (medicationId, pharmacyId, priceData) => {
  const prices = getPrices();
  const existingIndex = prices.findIndex(
    price => price.medicationId === medicationId && price.pharmacyId === pharmacyId
  );
  
  if (existingIndex >= 0) {
    // Update existing price
    prices[existingIndex] = {
      ...prices[existingIndex],
      ...priceData,
      lastUpdated: new Date().toISOString(),
      isAvailable: priceData.stock > 0
    };
  } else {
    // Create new price entry
    const newPrice = {
      id: (prices.length + 1).toString(),
      medicationId,
      pharmacyId,
      ...priceData,
      lastUpdated: new Date().toISOString(),
      isAvailable: priceData.stock > 0
    };
    prices.push(newPrice);
  }
  
  savePrices(prices);
  return prices[existingIndex] || prices[prices.length - 1];
};

const filterPrices = (prices, filters) => {
  let filteredPrices = [...prices];
  
  // Price range filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filteredPrices = filteredPrices.filter(price => 
      price.price >= min && price.price <= max
    );
  }
  
  // Available only filter
  if (filters.availableOnly) {
    filteredPrices = filteredPrices.filter(price => price.isAvailable);
  }
  
  // Sort by specified criteria
  if (filters.sortBy === 'price') {
    filteredPrices.sort((a, b) => a.price - b.price);
  }
  
  return filteredPrices;
};

module.exports = {
  getPrices,
  findPricesByMedication,
  findPricesByPharmacy,
  updatePrice,
  filterPrices
};