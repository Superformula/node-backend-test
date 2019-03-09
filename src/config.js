const env = process.env.NODE_ENV || 'local'

  const local = {
    app: {
      port: process.env.LOCAL_APP_PORT || 3000
    },
    db: {
      url: process.env.LOCAL_MONGODB_URL || 'mongodb://localhost:27017',
      name: process.env.LOCAL_MONGODB_NAME || 'golfAthleteTest'
    }
  }
  const dev = {
    app: {
      port: process.env.DEV_APP_PORT || 3000
    },
    db: {
      host: process.env.DEV_MONGODB_URL, // MongoDB Atlas URL using DNS seedlist connection format
      name: process.env.DEV_MONGODB_NAME
    }
  }

  const config = {
    local,
    dev
}

module.exports = config[env]
