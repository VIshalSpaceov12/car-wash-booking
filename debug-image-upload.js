// Simple debug script to test image upload
const fs = require('fs');

// Create a very small test image (1x1 pixel)
const smallTestImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

console.log('🔍 Debug Image Upload');
console.log('===================');
console.log('Small test image size:', smallTestImage.length, 'characters');

// Test payload
const testPayload = {
  make: 'Toyota',
  model: 'Test',
  year: 2023,
  color: 'Red',
  plateNumber: 'TEST123',
  vehicleType: 'car',
  image: smallTestImage
};

console.log('Test payload size:', JSON.stringify(testPayload).length, 'bytes');
console.log('');
console.log('To debug manually:');
console.log('1. Open browser console (F12)');
console.log('2. Try uploading a small image');
console.log('3. Check for any console errors');
console.log('4. Check Network tab for the API call details');
console.log('');
console.log('Expected base64 format:', smallTestImage.substring(0, 50) + '...');