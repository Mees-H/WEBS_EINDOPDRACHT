const express = require('express')
const mongo = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const app = express()
const port = 3001;

app.use('/create', (req, res) => {
    // add a new target to the mongo database with coordinates and status
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("targets");
        var myobj = { latitude: "51.687926", longitude: "5.286469", status: "Pending" };
        dbo.collection("targets").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });

    res.send('A target owner creates targets through this endpoint')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})