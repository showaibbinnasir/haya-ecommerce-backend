const express = require("express")
const app = express();

const port = process.env.PORT || 5000;
const cors = require('cors')
app.use(cors())
app.use(express.json())
const { query } = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = "mongodb+srv://haya-ecommerce:ud1PFYqjW3UAZZWO@myfirstdb.w4kvmll.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const orders = client.db('HayaEcommerce').collection('orders')
        const allProducts = client.db('HayaEcommerce').collection('allProducts')
        const users = client.db('HayaEcommerce').collection('users')
        const cart = client.db('HayaEcommerce').collection('cart')
        app.get('/featuredProducts', async (req, res) => {
            const query = { featuredProduct: true }
            const result = await allProducts.find(query).limit(4).sort({ _id: -1 }).toArray();
            res.send(result);
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await allProducts.findOne(query);
            res.send(result)
        })
        app.get('/latestProducts', async (req, res) => {
            const query = {}
            const result = await allProducts.find(query).sort({ _id: -1 }).limit(12).toArray()
            res.send(result)
        })
        app.get('/allCategory', async (req, res) => {
            const desiredCategory = req.query.category;
            let query = {}
            if (desiredCategory) {
                query = { category: desiredCategory }
            }
            const result = await allProducts.find(query).toArray()
            res.send(result)
        })
        app.get('/allProducts', async (req, res) => {
            const subcategory = req.query.subcategory;
            let query = {}
            if (subcategory) {
                query = { subCategory: subcategory }
            }
            const result = await allProducts.find(query).toArray()
            res.send(result)
        })
        app.get('/cart', async (req, res) => {
            const email = req.query.email
            let query = {}
            if (email) {
                query = { userEmail: email }
            } else {
                query = {}
            }
            const result = await cart.find(query).toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await users.insertOne(newUser)
            res.send(result)
        })
        app.post('/cart', async (req, res) => {
            const newUser = req.body;
            const result = await cart.insertOne(newUser)
            res.send(result)
        })
        app.post('/orders', async (req, res) => {
            const order = req.body;
            if (order.length === 1) {
                const result = await orders.insertOne(order[0])
                res.send(result)
            } else {
                const result = await orders.insertMany(order)
                res.send(result)

            }      // console.log(order.length);
        })
        app.get('/allorders', async (req, res) => {
            const email = req.query.mail
            let query = {}
            if (email) {
                query = { userEmail: email }
            } else {
                query = {}
            }
            const result = await orders.find(query).toArray()
            res.send(result);
        })
        app.get('/users', async (req, res) => {
            const email = req.query.email;
            let query = {}
            if (email) {
                query = { userEmail: email }
            }
            const result = await users.find(query).toArray()
            res.send(result)
        })
        app.get('/searchresult', async (req, res) => {
            const searchId = req.query.searchId;

            let query = {}
            if (searchId) {
                query = { name: { $regex: searchId, $options: 'i' } }
            }
            const result = await allProducts.find(query).toArray()
            res.send(result)
        })
        app.put('/allPost/featuredtrue/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const user = req.body;
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    featuredProduct: user.featuredProduct,
                }
            }
            const result = await allProducts.updateOne(filter, updatedUser, option);
            res.send(result);
        })
        app.put('/allPost/featuredfalse/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const user = req.body;
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    featuredProduct: user.featuredProduct,
                }
            }
            const result = await allProducts.updateOne(filter, updatedUser, option);
            res.send(result);
        })
        app.put('/deliver/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const user = req.body;
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    confirm: user.confirm,
                }
            }
            const result = await orders.updateOne(filter, updatedUser, option);
            res.send(result);
        })
        app.put('/allUser/blockUser/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const user = req.body;
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    access: user.isBlocked,
                }
            }
            const result = await users.updateOne(filter, updatedUser, option);
            res.send(result);
        })
        app.put('/allUser/unblockUser/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const user = req.body;
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    access: user.isBlocked,
                }
            }
            const result = await users.updateOne(filter, updatedUser, option);
            res.send(result);
        })
        app.delete('/deletecart/:id', async (req, res) => {

            const data = req.params.id;
            const query = { _id: new ObjectId(data) };
            const result = await cart.deleteOne(query);
            res.send(result)

        })
        app.delete('/postdelete/:id', async (req, res) => {
            const data = req.params.id;
            const query = { _id: new ObjectId(data) };
            const result = await allProducts.deleteOne(query);
            res.send(result)
        })

    } catch {
        console.log("database not connected");
    }
}


run().catch(console.log)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})