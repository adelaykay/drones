const handleGetDroneLoadInfo = (req, res, db, ObjectId) => {
  let meds = []
  db.collection('drone_medication')
    .aggregate([
      {
        $match: { drone_id: ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: 'medication',
          localField: 'medication_id',
          foreignField: '_id',
          as: 'medication',
        },
      },
    ])
    .forEach(med => meds.push(med.medication[0]))
    .then(() => {
      if (meds.length) {
        res.status(200).json(meds)
      } else {
        res.status(200).json('Drone is not loaded')
      }
    })
    .catch(err =>
      res.status(500).json('Could not fetch drone load information')
    )
}

export default handleGetDroneLoadInfo
