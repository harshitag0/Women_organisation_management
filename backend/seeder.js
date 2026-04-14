const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sakhiconnect')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => { console.log(err); process.exit(1); });

const importData = async () => {
  try {
    // Only clear non-product/order data to preserve real marketplace data
    await User.deleteMany();
    await Event.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const memberPassword = await bcrypt.hash('member123', salt);

    // ─── System Users ───
    const systemUsers = await User.insertMany([
      {
        name: 'Admin',
        username: 'admin',
        email: 'admin@krantijyoti.in',
        password: hashedPassword,
        role: 'Admin',
        address: 'Nagpur, Maharashtra',
      },
    ]);

    const adminUser = systemUsers[0]._id;

    // ─── 30 Real Krantijyoti Mahila Gat Members ───
    const members = [
      { srNo: 1,  name: 'Sunita Patil',      age: 35, contact_no: '9876543210', group_role: 'President',  savings: 12000 },
      { srNo: 2,  name: 'Rekha Sharma',      age: 32, contact_no: '9876543211', group_role: 'Secretary',  savings: 10500 },
      { srNo: 3,  name: 'Asha Verma',        age: 29, contact_no: '9876543212', group_role: 'Treasurer',  savings: 9800  },
      { srNo: 4,  name: 'Pooja Deshmukh',    age: 31, contact_no: '9876543213', group_role: 'Member',     savings: 8500  },
      { srNo: 5,  name: 'Meena Joshi',       age: 38, contact_no: '9876543214', group_role: 'Member',     savings: 11200 },
      { srNo: 6,  name: 'Kavita Thakur',     age: 27, contact_no: '9876543215', group_role: 'Member',     savings: 7600  },
      { srNo: 7,  name: 'Rani Gupta',        age: 34, contact_no: '9876543216', group_role: 'Member',     savings: 9900  },
      { srNo: 8,  name: 'Anita Yadav',       age: 30, contact_no: '9876543217', group_role: 'Member',     savings: 8100  },
      { srNo: 9,  name: 'Priya Tiwari',      age: 28, contact_no: '9876543218', group_role: 'Member',     savings: 7200  },
      { srNo: 10, name: 'Neha Kale',         age: 33, contact_no: '9876543219', group_role: 'Member',     savings: 9400  },
      { srNo: 11, name: 'Manisha Pawar',     age: 36, contact_no: '9876543220', group_role: 'Member',     savings: 11800 },
      { srNo: 12, name: 'Sneha More',        age: 26, contact_no: '9876543221', group_role: 'Member',     savings: 6800  },
      { srNo: 13, name: 'Shweta Kulkarni',   age: 29, contact_no: '9876543222', group_role: 'Member',     savings: 7500  },
      { srNo: 14, name: 'Vaishali Patode',   age: 40, contact_no: '9876543223', group_role: 'Member',     savings: 13000 },
      { srNo: 15, name: 'Deepa Chavan',      age: 37, contact_no: '9876543224', group_role: 'Member',     savings: 11500 },
      { srNo: 16, name: 'Lata Ingle',        age: 41, contact_no: '9876543225', group_role: 'Member',     savings: 12500 },
      { srNo: 17, name: 'Komal Borse',       age: 24, contact_no: '9876543226', group_role: 'Member',     savings: 6000  },
      { srNo: 18, name: 'Bharti Jaiswal',    age: 30, contact_no: '9876543227', group_role: 'Member',     savings: 8200  },
      { srNo: 19, name: 'Nisha Gawande',     age: 28, contact_no: '9876543228', group_role: 'Member',     savings: 7100  },
      { srNo: 20, name: 'Geeta Sahu',        age: 39, contact_no: '9876543229', group_role: 'Member',     savings: 11900 },
      { srNo: 21, name: 'Alka Wankhede',     age: 35, contact_no: '9876543230', group_role: 'Member',     savings: 10100 },
      { srNo: 22, name: 'Rupa Bagde',        age: 27, contact_no: '9876543231', group_role: 'Member',     savings: 7400  },
      { srNo: 23, name: 'Savita Bansod',     age: 34, contact_no: '9876543232', group_role: 'Member',     savings: 9200  },
      { srNo: 24, name: 'Jyoti Meshram',     age: 31, contact_no: '9876543233', group_role: 'Member',     savings: 8600  },
      { srNo: 25, name: 'Sarika Pande',      age: 29, contact_no: '9876543234', group_role: 'Member',     savings: 7900  },
      { srNo: 26, name: 'Usha Dhote',        age: 42, contact_no: '9876543235', group_role: 'Member',     savings: 13500 },
      { srNo: 27, name: 'Mamta Kadu',        age: 33, contact_no: '9876543236', group_role: 'Member',     savings: 9700  },
      { srNo: 28, name: 'Varsha Kapse',      age: 26, contact_no: '9876543237', group_role: 'Member',     savings: 6900  },
      { srNo: 29, name: 'Seema Dongre',      age: 37, contact_no: '9876543238', group_role: 'Member',     savings: 11000 },
      { srNo: 30, name: 'Archana Bhadke',    age: 32, contact_no: '9876543239', group_role: 'Member',     savings: 8900  },
    ];

    const memberDocs = members.map(m => ({
      role: 'Member',
      name: m.name,
      username: m.name.toLowerCase().replace(/\s+/g, '.') + m.srNo,
      password: memberPassword,
      contact_no: m.contact_no,
      age: m.age,
      group_role: m.group_role,
      savings: m.savings,
      address: 'Nagpur, Maharashtra',
    }));

    await User.insertMany(memberDocs);

    // ─── Sample Event ───
    await Event.insertMany([
      {
        title: 'Monthly Krantijyoti Mahila Gat Meeting',
        description: 'Monthly meeting for all group members to discuss savings, loans and upcoming events.',
        location: 'Community Hall, Nagpur',
        date: new Date('2026-05-01'),
        admin_id: adminUser,
      },
    ]);

    console.log('\n✅ Data imported successfully!');
    console.log('─────────────────────────────────────────');
    console.log('Admin     → username: admin       | password: password123');
    console.log('Members   → username: sunita.patil1 etc. | password: member123');
    console.log('─────────────────────────────────────────\n');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
