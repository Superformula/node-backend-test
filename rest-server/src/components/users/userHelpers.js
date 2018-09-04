import { User } from '../../config/database/collections/userCollections';

const addUserHelper = ({ name, dob, address, description }) => new User({
  name, dob, address, description
}).save();

const fetchAllUserHelper = () => User.find({});

const fetchSingleUserHelper = _id => User.findOne({ _id });

const updateUserHelper = (_id, { name, dob, address, description }) => User.updateOne(_id, {
  name, dob, address, description
});

const deleteUserHelper = _id => User.deleteOne({ _id });

export { addUserHelper, fetchAllUserHelper, fetchSingleUserHelper, updateUserHelper, deleteUserHelper };