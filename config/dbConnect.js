const mongoose = require ('mongoose');

const dbConnect = async () => {
  try {
    const connect = mongoose.connect (
      process.env.MONGODB_URL
    );
    console.log ('database connection successful');
  } catch (error) {
    console.log ('database connection failed!');
  }
};

module.exports = dbConnect;
