import { addUserHelper, fetchAllUserHelper, fetchSingleUserHelper, updateUserHelper, deleteUserHelper } from './userHelpers';

const addUser = async (req, res) => {
  try {
    const newUser = await addUserHelper(req.body);
    res.status(201).send(newUser);
  }
  catch (err) {
    res.status(400).send({error: 'Could not create User'});
  }
};

const fetchAllUser = async (req, res) => {
  try {
    const allUser = await fetchAllUserHelper();
    res.status(200).send(allUser);
  }
  catch (err) {
    res.status(400).send({error: 'Could not find Users'});
  }
};

const fetchSingleUser = async (req, res) => {
  try{
    const singleUser = await fetchSingleUserHelper(req.params);
    res.status(200).send(singleUser);
  }
  catch (err) {
    res.status(400).send({error: 'Could not find User'});
  }
};

const updateUser = async (req, res) => {
  try {
    if (Object.keys(req.body) === 4) {
      const updated = await updateUserHelper(req.params, req.body);
      res.status(201).send(updated);
    } else {
      const singleUser = await fetchSingleUserHelper(req.params);
      const filledBody = {
        name: req.body.name ? req.body.name : singleUser.name,
        dob: req.body.dob ? req.body.dob: singleUser.dob,
        address: req.body.address ? req.body.address : singleUser.address,
        description: req.body.description ? req.body.description : singleUser.description
      };
      const updated = await updateUserHelper(req.params, filledBody);
      res.status(201).send(updated);
    }
  }
  catch (err) {
    res.status(400).send({error: 'Could not update User'});
  }
};

const deleteUser = async (req, res) => {
  try {
    res.status(200).send();
  }
  catch (err) {
    res.status(400).send({error: 'Could not delete User'});
  }
};

export { addUser, fetchAllUser, fetchSingleUser, updateUser, deleteUser };