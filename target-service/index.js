const express = require('express')
const bodyParser = require('body-parser');
const url = "mongodb://localhost:27017/targets";
const mongoose = require('mongoose');

const app = express()
const port = 3001;

mongoose.connect(url);

const TargetSchema = new mongoose.Schema({ 
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  status: {
    type: String,
    required: false,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  }
});

const Target = mongoose.model('targets', TargetSchema);

app.use(bodyParser.json());

app.post('/targets', async (req, res) => {
  try {
    const target = new Target(req.body);
    await target.validate();
    await target.save();
    res.status(200).json({target: target, message: 'Successfully created target'});
  } catch (error) {
    res.status(500).send(error); 
  }
});

app.get('/targets/:id', async (req, res) => {
  try {
    const target = await Target.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
  }
    res.status(200).json({target: target, message: 'Success'});
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/targets/:id', async (req, res) => {
  try {
    const target = new Target(req.body);
    await target.validate();
    await Target.findByIdAndUpdate(req.params.id, req.body);
    
    res.status(200).json({target: target, message: 'Successfully updated target'});
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/targets/:id', async (req, res) => {
  try {
    const target = await Target.findByIdAndDelete(req.params.id);
    res.send({target: target, message: 'Successfully deleted target'});
  } catch (error) {
    res.status(500).send(error);
  }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})