import axios from 'axios';
import { fetchSingleUserHelper } from '../users/userHelpers';

const mapboxAPIKey = process.env.mapboxAPIKey;

const fetchUserLocationCoordinates = async (req, res) => {
  try {
    const singleUser = await fetchSingleUserHelper(req.params);
    let loc = singleUser.address.split(' ').join('%20');
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${loc}.json?access_token=${mapboxAPIKey}`;
    let coords = await axios.get(url);
    coords.data && res.status(200).send({'latitude': coords.data.features[0].center[1], 'longitutde': coords.data.features[0].center[0]});
  }
  catch (err) {
    res.status(400).send({error: 'Unable to fetch location information from user id'});
  }
};

export { fetchUserLocationCoordinates };