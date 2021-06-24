const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()

const port = process.env.PORT || 5053;
console.log(process.env.DB_NAME)

app.use(cors())
app.use(bodyParser.json())
// intro...
app.get('/', (req, res) => {
  res.send('Hello World! I am shamim here- https://github.com/shamim-a')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjyoa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // console.log("connection error", err)
  const productsCollection = client.db("ebonikdb").collection("products");
  const ordersCollection = client.db("groceryList").collection("orders");
//   console.log("Database connected");

  // inserting product to data base
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product)
    .then(result => {
      res.send(result.insertedCount > 0)
    });
  })

  // inserting order to data base
  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    });
  })

  // getting data from database
  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, products) => {
      res.send(products);
    })
  });

  // getting orders data from database
  app.get('/orders', (req, res) => {
    ordersCollection.find({email: req.query.email})
    .toArray((err, docs) => {
      console.log("orders", docs);
      res.send(docs);
    })
  });

  // find a single object via ObjectId
  app.get('/product/:id', (req, res) => {
    productsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, docs) => {
      res.send(docs);
    })
  });

  // delete a product from database
  app.delete('/deleteProduct/:id', (req, res) => {
    productsCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    });
  });

});








// listen port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})