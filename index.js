const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware 
app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xclu1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("ema-john").collection("product");
    console.log("connected");
    client.close();
});


app.get('/', (req, res) => {
    res.send("Welcome to Ema John")
})

app.listen(port, () => {
    console.log("This port is", port);
})
