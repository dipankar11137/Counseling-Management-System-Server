const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ipibfdi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // console.log("database connect");

    const userCollection = client.db("counselingManagement").collection("user");

    // // // // // // // // // // // //

    //  *********  User  ********//

    // create and update User
    //create and update a user
    app.put("/create-user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;

      const filter = { email: email };
      const options = { upsert: true };

      const updatedDoc = {
        $set: user,
      };

      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    // get all users from db
    app.get("/users", async (req, res) => {
      const query = {};

      const cursor = userCollection.find(query);
      const users = await cursor.toArray();

      res.send(users);
    });

    // // all User filter by email category
    // app.get("/user/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email };
    //   const cursor = userCollection.find(query);
    //   const user = await cursor.toArray();
    //   res.send(user);
    // });

    // //  *********  Complain  ********//

    // // get complains

    // app.get("/complains", async (req, res) => {
    //   const query = {};
    //   const cursor = complainCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    // // post Complains
    // app.post("/complains", async (req, res) => {
    //   const newComplain = req.body;
    //   const result = await complainCollection.insertOne(newComplain);
    //   res.send(result);
    // });
    // // // Delete one complain
    // app.delete("/complains/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await complainCollection.deleteOne(query);
    //   res.send(result);
    // });

    // //  Complain filter by email
    // app.get("/complains/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email };
    //   const cursor = complainCollection.find(query);
    //   const user = await cursor.toArray();
    //   res.send(user);
    // });
    // //  Complain filter by Division
    // app.get("/complain/:division", async (req, res) => {
    //   const division = req.params.division;
    //   const query = { division };
    //   const cursor = complainCollection.find(query);
    //   const user = await cursor.toArray();
    //   res.send(user);
    // });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running City Complain ");
});

app.listen(port, () => {
  console.log("City Complain  server is running ");
});
