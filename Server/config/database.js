import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Skip database connection if no MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('No MONGODB_URI provided, running without database');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    console.log('Continuing without database connection');
  }
};

export default connectDB;
