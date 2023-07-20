const handleBatteryCheck = (req, res, db, ObjectId) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection('drones')
      .findOne({ _id: ObjectId(req.params.id) })
      .then(drone =>
        res
          .status(200)
          .json(
            'Drone ' +
              drone.serial_number +
              ' battery level at ' +
              drone.battery_capacity +
              '%'
          )
      )
      .catch(err => res.status(500).json('Could not fetch battery level'))
  } else {
    res.status(500).json('Invalid drone Id')
  }
}

export default handleBatteryCheck