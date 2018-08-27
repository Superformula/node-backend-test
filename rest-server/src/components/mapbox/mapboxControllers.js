const fetchLocationCoordinates = async (req, res) => {
  try {
    res.status(200).send();
  }
  catch (err) {
    res.status(400).send();
  }
};

export { fetchLocationCoordinates };