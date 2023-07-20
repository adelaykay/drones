const handleCheckAvailableDrones = (req, res, db) => {
  let drones = []
  db.collection('drones')
    .find({ state: req.query.state })
    .sort({ battery_capacity: 1 })
    .project({ created_at: 0, updated_at: 0 })
    .forEach(drone => {
      drones.push(drone)
    })
    .then(() => {
      if (drones.length > 0) {
        // console.log(req.query.state)
        res.status(200).json(drones)
      } else {
        res.status(200).json('There are no idle drones available for loading')
      }
    })
    .catch(err => res.status(500).json(''))
}

export default handleCheckAvailableDrones