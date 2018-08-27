const addUser = (req, res) => {
  res.status(201).send();
};

const fetchAllUser = (req, res) => {
  res.status(200).send();
};

const fetchSingleUser = (req, res) => {
  res.status(200).send();
};

const updateUser = (req, res) => {
  res.status(201).send();
};

const deleteUser = (req, res) => {
  res.status(200).send();
};

export { addUser, fetchAllUser, fetchSingleUser, updateUser, deleteUser };