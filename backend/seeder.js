const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sakhiconnect')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => { console.log(err); process.exit(1); });

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Event.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const createdUsers = await User.insertMany([
      { name: 'Admin User',        username: 'admin',   email: 'admin@sakhiconnect.in', password: hashedPassword, role: 'Admin' },
      { name: 'Savitri Bachatgat', username: 'bg123',   email: 'bg@sakhiconnect.in',    password: hashedPassword, role: 'Bachatgat', president_name: 'Savitri Patil' },
      { name: 'Priya Member',      username: 'member1', email: 'priya@example.com',     password: hashedPassword, role: 'Member',    address: 'Pune' },
      { name: 'Anjali Customer',   username: 'cust1',   email: 'anjali@example.com',    password: hashedPassword, role: 'Customer',  address: 'Mumbai' },
    ]);

    const bachatgatUser = createdUsers[1]._id;
    const adminUser     = createdUsers[0]._id;

    await Product.insertMany([
      // FOOD
      {
        name: 'Handmade Papads',
        description: 'Sun-dried urad dal papads, crispy and flavourful. Made using traditional recipes passed down through generations.',
        category: 'Food', price: 120, quantity: 80, unit: 'pack',
        image_url: '/product-food.png', bachatgat_id: bachatgatUser,
      },
      {
        name: 'Mixed Vegetable Pickle',
        description: 'Tangy homemade mixed vegetable pickle prepared with fresh seasonal vegetables and natural spices.',
        category: 'Food', price: 180, quantity: 60, unit: 'jar',
        image_url: '/product-food.png', bachatgat_id: bachatgatUser,
      },
      {
        name: 'Masala Spice Blend',
        description: 'Aromatic homemade garam masala blend with no artificial preservatives. Pure and natural.',
        category: 'Food', price: 95, quantity: 100, unit: '100g pack',
        image_url: '/product-food.png', bachatgat_id: bachatgatUser,
      },

      // CRAFTS
      {
        name: 'Jute Shopping Bag',
        description: 'Eco-friendly handwoven jute bag with cotton handles. Strong, durable, and reusable.',
        category: 'Crafts', price: 220, quantity: 50, unit: 'piece',
        image_url: '/product-crafts.png', bachatgat_id: bachatgatUser,
      },
      {
        name: 'Macrame Wall Hanging',
        description: 'Handcrafted boho-style macrame wall decor made from natural cotton cord.',
        category: 'Crafts', price: 450, quantity: 25, unit: 'piece',
        image_url: '/product-crafts.png', bachatgat_id: bachatgatUser,
      },
      {
        name: 'Woven Bamboo Basket',
        description: 'Hand-woven bamboo basket, ideal for storage or gifting. Sustainable and long-lasting.',
        category: 'Crafts', price: 310, quantity: 40, unit: 'piece',
        image_url: '/product-crafts.png', bachatgat_id: bachatgatUser,
      },

      // TEXTILES
      {
        name: 'Block Print Cotton Dupatta',
        description: 'Hand block-printed cotton dupatta with natural vegetable dyes. Each piece is uniquely crafted.',
        category: 'Textiles', price: 550, quantity: 30, unit: 'piece',
        image_url: '/product-textiles.png', bachatgat_id: bachatgatUser,
      },
      {
        name: 'Handwoven Khadi Saree',
        description: 'Pure khadi cotton saree with traditional border. Comfortable, breathable, and elegant.',
        category: 'Textiles', price: 1200, quantity: 15, unit: 'piece',
        image_url: '/product-textiles.png', bachatgat_id: bachatgatUser,
      },
      {
        name: 'Embroidered Cushion Cover',
        description: 'Hand-embroidered cushion cover with floral motifs. Adds colour and personality to your living space.',
        category: 'Textiles', price: 280, quantity: 60, unit: 'piece',
        image_url: '/product-textiles.png', bachatgat_id: bachatgatUser,
      },

      // BEAUTY
      {
        name: 'Turmeric Face Pack',
        description: 'Natural turmeric and sandalwood face pack. Brightens skin and gives a natural glow.',
        category: 'Beauty', price: 150, quantity: 70, unit: '50g jar',
        image_url: '/product-beauty.png', bachatgat_id: bachatgatUser,
      },
      {
        name: 'Herbal Hair Oil',
        description: 'Blend of bhringraj, amla, and coconut oil. Promotes hair growth and reduces hair fall naturally.',
        category: 'Beauty', price: 200, quantity: 55, unit: '100ml bottle',
        image_url: '/product-beauty.png', bachatgat_id: bachatgatUser,
      },
      {
        name: 'Neem & Rose Soap',
        description: 'Handcrafted cold-process soap with neem extract and rose water. Gentle on skin, chemical-free.',
        category: 'Beauty', price: 80, quantity: 120, unit: 'bar',
        image_url: '/product-beauty.png', bachatgat_id: bachatgatUser,
      },

      // HOME DECOR
      {
        name: 'Hand-Painted Clay Diyas (Set of 6)',
        description: 'Set of 6 hand-painted terracotta diyas with traditional patterns. Perfect for home and gifting.',
        category: 'Home Decor', price: 180, quantity: 90, unit: 'set of 6',
        image_url: '/product-homedecor.png', bachatgat_id: bachatgatUser,
      },
      {
        name: 'Terracotta Planter Pot',
        description: 'Handmade terracotta pot with drainage hole. Ideal for indoor plants and succulents.',
        category: 'Home Decor', price: 250, quantity: 45, unit: 'piece',
        image_url: '/product-homedecor.png', bachatgat_id: bachatgatUser,
      },
      {
        name: 'Wooden Coaster Set (Set of 4)',
        description: 'Set of 4 hand-painted wooden coasters with floral designs. Protects surfaces in style.',
        category: 'Home Decor', price: 320, quantity: 35, unit: 'set of 4',
        image_url: '/product-homedecor.png', bachatgat_id: bachatgatUser,
      },
    ]);

    await Event.insertMany([
      {
        title: 'Annual SHG Meetup',
        description: 'Gathering of all self-help groups for annual review and planning.',
        location: 'Main Community Hall, Pune',
        date: new Date('2026-04-10'),
        admin_id: adminUser,
      },
    ]);

    console.log('Data imported successfully!');
    console.log('Credentials -- Admin: admin/password123 | Bachatgat: bg123/password123 | Member: member1/password123 | Customer: cust1/password123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
