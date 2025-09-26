// Simple API test script for 3D Model Management
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const TEST_TOKEN = 'your_jwt_token_here'; // Replace with actual token

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testAPI() {
  console.log('🧪 Testing 3D Model Management API...\n');

  try {
    // Test 1: Get admin info
    console.log('1. Testing admin info...');
    const adminInfo = await api.get('/admin/info');
    console.log('✅ Admin info:', adminInfo.data);

    // Test 2: Get categories
    console.log('\n2. Testing categories...');
    const categories = await api.get('/admin/categories');
    console.log('✅ Categories:', categories.data);

    // Test 3: Get tags
    console.log('\n3. Testing tags...');
    const tags = await api.get('/admin/tags');
    console.log('✅ Tags:', tags.data);

    // Test 4: Get models
    console.log('\n4. Testing models...');
    const models = await api.get('/admin/models');
    console.log('✅ Models:', models.data);

    // Test 5: Create a test category
    console.log('\n5. Testing category creation...');
    const newCategory = await api.post('/admin/categories', {
      name: 'Test Category',
      description: 'A test category for API testing'
    });
    console.log('✅ Created category:', newCategory.data);

    // Test 6: Create a test tag
    console.log('\n6. Testing tag creation...');
    const newTag = await api.post('/admin/tags', {
      name: 'test-tag'
    });
    console.log('✅ Created tag:', newTag.data);

    // Test 7: Update category
    console.log('\n7. Testing category update...');
    const updatedCategory = await api.put(`/admin/categories/${newCategory.data.data._id}`, {
      name: 'Updated Test Category',
      description: 'Updated description'
    });
    console.log('✅ Updated category:', updatedCategory.data);

    // Test 8: Update tag
    console.log('\n8. Testing tag update...');
    const updatedTag = await api.put(`/admin/tags/${newTag.data.data._id}`, {
      name: 'updated-test-tag'
    });
    console.log('✅ Updated tag:', updatedTag.data);

    // Test 9: Delete tag
    console.log('\n9. Testing tag deletion...');
    await api.delete(`/admin/tags/${newTag.data.data._id}`);
    console.log('✅ Deleted tag');

    // Test 10: Delete category
    console.log('\n10. Testing category deletion...');
    await api.delete(`/admin/categories/${newCategory.data.data._id}`);
    console.log('✅ Deleted category');

    console.log('\n🎉 All API tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
