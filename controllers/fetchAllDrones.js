const handleFetchAllDrones = (req, res, db, ObjectId) => {
  let drones = []
  db.collection('drones')
    .find()
    .sort({ serial_number: 1 })
    .forEach(drone => {
      drones.push(drone)
    })
    .then(() => {
      res.status(200).json(drones)
    })
    .catch(err => res.status(500).json(err))
}

export default handleFetchAllDrones
