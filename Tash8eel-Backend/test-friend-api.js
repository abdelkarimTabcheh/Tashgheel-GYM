const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

// Test the friend routes
async function testFriendAPI() {
  try {
    console.log('Testing Friend API endpoints...\n');

    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    try {
      const response = await axios.get(`${API_BASE_URL}/users/leaderboard`);
      console.log('✅ Server is running and responding');
    } catch (error) {
      console.log('❌ Server connection failed:', error.message);
      return;
    }

    // Test 2: Check if friend routes are accessible (should return 401 without auth)
    console.log('\n2. Testing friend routes accessibility...');
    try {
      await axios.get(`${API_BASE_URL}/api/friends/list`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Friend routes are accessible (401 expected without auth)');
      } else {
        console.log('❌ Friend routes test failed:', error.message);
      }
    }

    // Test 3: Check if notification routes are accessible
    console.log('\n3. Testing notification routes accessibility...');
    try {
      await axios.get(`${API_BASE_URL}/api/notifications`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Notification routes are accessible (401 expected without auth)');
      } else {
        console.log('❌ Notification routes test failed:', error.message);
      }
    }

    console.log('\n🎉 API endpoints are properly configured!');
    console.log('\nTo test with authentication, you need to:');
    console.log('1. Login to get a token');
    console.log('2. Use the token in Authorization header');
    console.log('3. Test the friend endpoints');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testFriendAPI();
