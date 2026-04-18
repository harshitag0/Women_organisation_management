const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Announcement = require('./models/Announcement');
require('dotenv').config();

// Use production MongoDB URI (hardcoded for seeding)
const MONGO_URI = 'mongodb+srv://hygandhi370123_db_user:ShilpaYogesh@women-org-db.f8q3ied.mongodb.net/womenDB?retryWrites=true&w=majority';

const seedData = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check existing data
    const existingUsers = await User.countDocuments();
    const existingProducts = await Product.countDocuments();
    console.log(`📊 Current data: ${existingUsers} users, ${existingProducts} products`);

    // Find admin user to use as bachatgat_id
    let adminUser = await User.findOne({ role: 'Admin' });
    if (!adminUser) {
      console.log('Creating admin user...');
      adminUser = await User.create({
        name: 'Admin User',
        username: 'admin',
        password: 'admin123',
        email: 'admin@krantijyoti.org',
        contact_no: '9876543210',
        role: 'Admin',
        address: 'Nagpur, Maharashtra'
      });
      console.log('✅ Admin user created');
    }

    // Create sample members
    console.log('👥 Creating sample members...');
    const memberNames = [
      'Sunita Devi', 'Meera Sharma', 'Asha Patel', 'Priya Singh', 'Kavita Rao',
      'Anjali Gupta', 'Rekha Verma', 'Pooja Joshi', 'Neha Desai', 'Suman Kumar',
      'Radha Iyer', 'Lakshmi Nair', 'Geeta Reddy', 'Savita Kulkarni', 'Usha Mehta',
      'Kamala Jain', 'Shanti Agarwal', 'Pushpa Mishra', 'Lata Pandey', 'Manju Tiwari',
      'Sarita Yadav', 'Kiran Bose', 'Nirmala Shah', 'Vandana Chopra', 'Ritu Malhotra',
      'Seema Kapoor', 'Anita Saxena', 'Bharti Sinha', 'Deepa Bansal', 'Hemlata Dubey'
    ];

    const villages = ['Nagpur', 'Wardha', 'Chandrapur', 'Gondia', 'Bhandara', 'Gadchiroli'];
    const roles = ['President', 'Secretary', 'Treasurer', 'Member', 'Member', 'Member'];

    const members = [];
    for (let i = 0; i < 30; i++) {
      const member = {
        name: memberNames[i],
        username: memberNames[i].toLowerCase().replace(/\s+/g, '.') + (1000 + i),
        password: 'member123',
        email: `${memberNames[i].toLowerCase().replace(/\s+/g, '.')}@example.com`,
        contact_no: `98765${43210 + i}`,
        role: 'Member',
        address: villages[i % villages.length],
        age: 25 + (i % 30),
        group_role: roles[i % roles.length],
        savings: Math.floor(Math.random() * 5000) + 1000,
        bachatgat_id: adminUser._id
      };
      members.push(member);
    }

    // Only insert members that don't exist
    const existingMemberCount = await User.countDocuments({ role: 'Member' });
    if (existingMemberCount < 30) {
      await User.insertMany(members);
      console.log(`✅ Created ${members.length} members`);
    } else {
      console.log('⚠️ Members already exist, skipping...');
    }

    // Get a member to use as product creator
    const sampleMember = await User.findOne({ role: 'Member' });

    // Create sample products
    console.log('🛍️ Creating sample products...');
    const products = [
      { name: 'Organic Honey', category: 'Food', price: 150, description: 'Pure organic honey from local farms', quantity: 50, unit: 'bottle' },
      { name: 'Handwoven Basket', category: 'Crafts', price: 200, description: 'Beautiful handwoven bamboo basket', quantity: 30, unit: 'piece' },
      { name: 'Clay Pot', category: 'Home Decor', price: 300, description: 'Traditional clay pot for cooking', quantity: 25, unit: 'piece' },
      { name: 'Herbal Soap', category: 'Beauty', price: 50, description: 'Natural herbal soap', quantity: 100, unit: 'piece' },
      { name: 'Mango Pickle', category: 'Food', price: 100, description: 'Homemade spicy mango pickle', quantity: 40, unit: 'jar' },
      { name: 'Cotton Thread', category: 'Textiles', price: 80, description: 'Pure cotton thread for weaving', quantity: 60, unit: 'roll' },
      { name: 'Scented Candle', category: 'Home Decor', price: 120, description: 'Handmade scented candles', quantity: 45, unit: 'piece' },
      { name: 'Natural Paint', category: 'Crafts', price: 250, description: 'Eco-friendly natural paint', quantity: 20, unit: 'bottle' },
      { name: 'Turmeric Powder', category: 'Food', price: 90, description: 'Pure organic turmeric powder', quantity: 70, unit: 'packet' },
      { name: 'Jute Bag', category: 'Crafts', price: 150, description: 'Eco-friendly jute shopping bag', quantity: 55, unit: 'piece' },
      { name: 'Terracotta Vase', category: 'Home Decor', price: 180, description: 'Handcrafted terracotta vase', quantity: 35, unit: 'piece' },
      { name: 'Neem Face Pack', category: 'Beauty', price: 70, description: 'Natural neem face pack', quantity: 80, unit: 'packet' },
      { name: 'Chili Powder', category: 'Food', price: 60, description: 'Spicy red chili powder', quantity: 90, unit: 'packet' },
      { name: 'Embroidered Cloth', category: 'Textiles', price: 400, description: 'Beautiful embroidered fabric', quantity: 15, unit: 'meter' },
      { name: 'Incense Sticks', category: 'Home Decor', price: 40, description: 'Aromatic incense sticks', quantity: 120, unit: 'packet' },
      { name: 'Wooden Toy', category: 'Crafts', price: 220, description: 'Handcrafted wooden toy', quantity: 28, unit: 'piece' },
      { name: 'Coconut Oil', category: 'Beauty', price: 130, description: 'Pure coconut oil', quantity: 65, unit: 'bottle' },
      { name: 'Tamarind Paste', category: 'Food', price: 85, description: 'Tangy tamarind paste', quantity: 50, unit: 'jar' },
      { name: 'Silk Scarf', category: 'Textiles', price: 500, description: 'Pure silk handwoven scarf', quantity: 12, unit: 'piece' },
      { name: 'Bamboo Lamp', category: 'Home Decor', price: 350, description: 'Eco-friendly bamboo lamp', quantity: 18, unit: 'piece' },
      { name: 'Papier Mache Box', category: 'Crafts', price: 280, description: 'Decorative papier mache box', quantity: 22, unit: 'piece' },
      { name: 'Rose Water', category: 'Beauty', price: 95, description: 'Pure rose water toner', quantity: 75, unit: 'bottle' },
      { name: 'Sesame Seeds', category: 'Food', price: 110, description: 'Organic sesame seeds', quantity: 60, unit: 'packet' },
      { name: 'Cotton Saree', category: 'Textiles', price: 800, description: 'Traditional cotton saree', quantity: 10, unit: 'piece' },
      { name: 'Wall Hanging', category: 'Home Decor', price: 320, description: 'Decorative wall hanging', quantity: 25, unit: 'piece' },
      { name: 'Beaded Jewelry', category: 'Crafts', price: 180, description: 'Handmade beaded jewelry', quantity: 40, unit: 'piece' },
      { name: 'Aloe Vera Gel', category: 'Beauty', price: 105, description: 'Pure aloe vera gel', quantity: 70, unit: 'bottle' },
      { name: 'Cardamom', category: 'Food', price: 200, description: 'Premium green cardamom', quantity: 30, unit: 'packet' },
      { name: 'Khadi Fabric', category: 'Textiles', price: 450, description: 'Pure khadi fabric', quantity: 20, unit: 'meter' },
      { name: 'Ceramic Plate', category: 'Home Decor', price: 160, description: 'Hand-painted ceramic plate', quantity: 35, unit: 'piece' }
    ];

    const productDocs = products.map(p => ({
      ...p,
      bachatgat_id: sampleMember._id,
      image_url: `/product-${p.category.toLowerCase().replace(/\s+/g, '')}.png`
    }));

    const existingProductCount = await Product.countDocuments();
    if (existingProductCount < 30) {
      await Product.insertMany(productDocs);
      console.log(`✅ Created ${productDocs.length} products`);
    } else {
      console.log('⚠️ Products already exist, skipping...');
    }

    // Create sample announcements
    console.log('📢 Creating sample announcements...');
    const announcements = [
      {
        title: 'Monthly Meeting Scheduled',
        message: 'Our monthly group meeting is scheduled for next Sunday at 10 AM. All members are requested to attend.',
        postedBy: adminUser._id
      },
      {
        title: 'New Product Training',
        message: 'We are organizing a training session on new product development. Interested members please register.',
        postedBy: adminUser._id
      },
      {
        title: 'Savings Milestone Achieved',
        message: 'Congratulations! Our group has achieved a savings milestone of Rs. 1 Lakh. Keep up the good work!',
        postedBy: adminUser._id
      }
    ];

    const existingAnnouncementCount = await Announcement.countDocuments();
    if (existingAnnouncementCount < 3) {
      await Announcement.insertMany(announcements);
      console.log(`✅ Created ${announcements.length} announcements`);
    } else {
      console.log('⚠️ Announcements already exist, skipping...');
    }

    // Final count
    const finalUsers = await User.countDocuments();
    const finalProducts = await Product.countDocuments();
    const finalAnnouncements = await Announcement.countDocuments();

    console.log('\n✅ SEEDING COMPLETE!');
    console.log('📊 Final counts:');
    console.log(`   - Users: ${finalUsers}`);
    console.log(`   - Products: ${finalProducts}`);
    console.log(`   - Announcements: ${finalAnnouncements}`);
    console.log('\n🎉 Your production database is now populated with data!');
    console.log('🌐 Visit your site: https://sharda-foundation.vercel.app');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
