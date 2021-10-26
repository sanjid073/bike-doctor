const express = require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors")
const app = express();
const port =process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0th5g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log("sdfgds");
      const database = client.db("carDoctor");
      const servicesCollections = database.collection("services");

      // get api
      app.get("/services", async(req, res) => {
        const query = servicesCollections.find({});
        const services = await query.toArray();
        res.send(services);
      })

      // get single service 
      app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id : ObjectId(id)}
        const service = await servicesCollections.findOne(query)
        res.json(service)
      })

      // post api
      app.post("/services", async (req, res) => {
        const service = req.body
        const result = await servicesCollections.insertOne(service);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.json(result)

      })
      
      // DELETE api
      app.delete("/services/:id", async (req, res) => {
        const id = req.params.id;
        console.log("hiiting api")
        const query = {_id: ObjectId(id)}
        const result = await servicesCollections.deleteOne(query);
        res.send(result);
      })





       
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);






app.get("/", (req, res) =>{
    res.send("running bike doctor server")
});

app.listen(port, () => {
    console.log("running bike doctor server", port);
})