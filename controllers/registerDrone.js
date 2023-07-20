const handleDroneRegister = (req, res, db, ObjectId) => {
  const drone = req.body
  drone._id = new ObjectId()
  drone.state = 'IDLE'
  drone.created_at = new Date()
  drone.updated_at = new Date()
  console.log(drone)

  db.collection('drones')
    .insertOne(drone)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => res.status(500).json('Could not register device'))
}

export default handleDroneRegister