const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB 연결 성공');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;