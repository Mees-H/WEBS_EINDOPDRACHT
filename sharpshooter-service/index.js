const express = require('express')

const app = express()
const port = 3002;

app.use('/create/:targetId', (req, res) => {
    res.send('Sharpshooters send pictures for specific tagets through this endpoint for targetId ' + req.params.targetId)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})