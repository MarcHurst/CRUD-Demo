// Requires
const dotenv = require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient


MongoClient.connect(`mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@${process.env.MONGOURL}/?${process.env.MONGOPARAMS}`)
.then(client => {
    console.log('Connected to MongoDB Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    // BodyParser needs to come prior to any Express methods.
    app.set('view engine', 'ejs') // Tells Express to use EJS as the template engine.
    app.use(bodyParser.urlencoded({extended: true})) // Allows bodyparser to access the form and data.
    app.use(bodyParser.json())
    app.use(express.static('public')) // Gives access to the public directory.
    app.get("/", (req, res) => {
        const cursor = db.collection('quotes')
            .find()
            .toArray()
            .then(results => res.render('index.ejs', {quotes: results}))
            .catch(error => console.error(error))
    })
    app.put("/quotes", (req, res) => {
        console.log(req.body)
        quotesCollection.findOneAndUpdate(
            {name: 'Flight'},
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {upsert: true}
        )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })
    app.post("/quotes", (req, res) => {
        quotesCollection.insertOne(req.body)
            .then(result => res.redirect('/'))
            .catch(error => console.error(error))
    })
    app.delete("/quotes", (req, res) => {
        quotesCollection.deleteOne(
            {name: req.body.name}
        )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json(`No Codex quote to delete`)
                }
                res.json(`Deleted Codex's Quote!`)
            })
            .catch(error => console.error(error))
    })
    app.listen(3000, _ => console.log(`listening on 3000`))
})
.catch(console.error) // If MongoClient.connect() promise status is rejected.