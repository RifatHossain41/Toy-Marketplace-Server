const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vb42ct1.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion?.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db('toy').collection('example');

    app.get('/example', async(req, res) => {
      const filter = {};
      const result = await toyCollection.find(filter).limit(20).toArray();
      res.send(result);
    })

    app.get('/mytoys/:email', async(req, res) => {
      const email = req.params.email;
      const query = { email : email }
      const result = await toyCollection.find(query).toArray()
      res.send(result);
    })

    app.get('/details/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.find(query)
      res.send(result);
    })

    app.post('/example', async (req, res) => {
      const allData = req.body;
      const result = await toyCollection.insertOne(allData);
      res.send(result)
    });

    app.get('/example/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query)
      res.send(result);
    })

    app.put('/example/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true }
      const updatedData = req.body;
      console.log(updatedData)
      const data = {
        $set: {
          price: updatedData.price,
          quantity: updatedData.quantity,
          description: updatedData.description
        }
      }
      const result = await toyCollection.updateOne(filter, data, options);
      res.send(result);

    })

    app.delete('/example/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
  res.send('Toy Server Is Running')
})

app.listen(port, () => {
  console.log(`Toy Server Is Running on port${port}`)
})