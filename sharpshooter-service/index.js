const express = require('express')

const app = express()
const port = 3002;

app.use('/', (req, res) => {
    res.send('Sharpshooter Service')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})