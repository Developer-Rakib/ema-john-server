const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middleware 
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xclu1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("ema-john").collection("product");

        // get data 
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {}
            let products;
            const cursor = productCollection.find(query)
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray()
            } else {
                products = await cursor.toArray();
            }
            res.send(products)
        })

        // get data by id
        app.post('/productsByID', async (req, res) => {
            let key = req.body;
            let ids = key.map(id => ObjectId(id))
            let query = { _id: { $in: ids } }
            let cursor = productCollection.find(query)
            let products = await cursor.toArray()
            console.log(key);
            res.send(products)
        })

        // count data 
        app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count })
        })

    }
    finally {
        // client.close();
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send("Welcome to Ema John")
})

app.listen(port, () => {
    console.log("This port is", port);
})
