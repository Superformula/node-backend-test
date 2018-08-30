import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  dob: { type: String },
  address: { type: String },
  description: { type: String }
}, { timestamps: {} });

const User = mongoose.model('User', userSchema);

export { User, userSchema };