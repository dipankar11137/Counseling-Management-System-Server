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

    const userCollection = client.db("counselingManagement").collection("user");
    const appointmentCollection = client
      .db("counselingManagement")
      .collection("appointments");
    const bookingCollection = client
      .db("counselingManagement")
      .collection("bookings");

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
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    // //  *********  appointments  ********//

    // // get appointments to query multiple collection  and them marge data

    app.get("/appointments", async (req, res) => {
      const date = req.query.date;
      const query = {};
      const options = await appointmentCollection.find(query).toArray();
      const bookingQuery = { appointmentDate: date };
      const alreadyBooked = await bookingCollection
        .find(bookingQuery)
        .toArray();
      //
      options.forEach((option) => {
        const optionBooked = alreadyBooked.filter(
          (book) => book.teacherName === option.name
        );
        const bookedSlots = optionBooked.map((book) => book.slot);
        const remainingSlots = option.slots.filter(
          (slot) => !bookedSlots.includes(slot)
        );
        option.slots = remainingSlots;
      });
      res.send(options);
    });

    // Post appointments
    app.post("/appointments", async (req, res) => {
      const appointmentsBook = req.body;
      const result = await appointmentCollection.insertOne(appointmentsBook);
      res.send(result);
    });

    // post Booking/counseling
    app.post("/bookings", async (req, res) => {
      const newBooking = req.body;
      const result = await bookingCollection.insertOne(newBooking);
      res.send(result);
    });
    // get Booking/counseling
    app.get("/bookings", async (req, res) => {
      const query = {};
      const cursor = bookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // //  Booking/counseling filter by Teacher email
    app.get("/booking/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = bookingCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    //  Booking/counseling filter by Student email
    app.get("/studentBooking/:studentsEmail", async (req, res) => {
      const studentsEmail = req.params.studentsEmail;
      const query = { studentsEmail };
      const cursor = bookingCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    // // Delete one Booking counseling
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

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
  res.send("Running Counseling Management ");
});

app.listen(port, () => {
  console.log("Counseling Management  server is running ");
});
