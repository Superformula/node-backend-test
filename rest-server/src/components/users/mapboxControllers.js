import axios from 'axios';
import { fetchSingleUserHelper } from './userHelpers';

const fetchUserLocationCoordinates = async (req, res) => {
  try {
    const singleUser = await fetchSingleUserHelper(req.params);
    const loc = encodeURI(singleUser.address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${loc}.json?access_token=${process.env.mapboxAPIKey}`;
    const coords = await axios.get(url);
    if (coords && coords.data) {
      const [longitude, latitude] = coords.data.features[0].center;
      res.status(200).send({latitude, longitude});
    } else {
      throw new Error;
    }
  }
  catch (err) {
    res.status(400).send({error: 'Unable to fetch location information from user id'});
  }
};

export { fetchUserLocationCoordinates };