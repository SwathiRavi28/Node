const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");
// const bcrypt = require("bcrypt");

const app = express();
dotenv.config();

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const port = process.env.PORT || 3000;
let dbUrl =process.env.DB_URL || "mongodb://127.0.0.1:27017";

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
    try {
     res.render("index.html")
     
    } catch (error) {
      console.log(error);
      res.send(500);
    }
  });

app.get("/get-mentors", async (req, res) => {
    try {
      let client = await mongoClient.connect(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true});
      let db = client.db("studentDetail");
      let result = await db.collection("mentor").find().toArray();
      res.status(200).json({ result });
      client.close();
    } catch (error) {
      console.log(error);
      res.send(500);
    }
  });
  app.get("/get-students", async (req, res) => {
    try {
      //console.log("entered");
      let client = await mongoClient.connect(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true});
      let db = client.db("studentDetail");
      let result = await db.collection("student").find().toArray();
      //console.log("res1:",result);
      res.status(200).json({ result });
      client.close();
    } catch (error) {
      console.log(error);
      res.send(500);
    }
  });
  app.get("/get-students1", async (req, res) => {
    try {
      //console.log("entered");
      let client = await mongoClient.connect(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true});
      let db = client.db("studentDetail");
      let result = await db.collection("student").find( { mentor:"" } ).toArray();
      //console.log("res1:",result);
      res.status(200).json({ result });
      client.close();
    } catch (error) {
      console.log(error);
      res.send(500);
    }
  });
  app.post("/add-mentor", async (req, res) => {
    try {
      let client = await mongoClient.connect(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true});
      let db = client.db("studentDetail");
      let result = await db.collection("mentor").insertOne(req.body);
      res.status(200).json({ message: "record created"});
      client.close();
    } catch (error) {
      console.log(error);
      res.send(500);
    }
  });
  app.post("/add-student", async (req, res) => {
      try {
        let client = await mongoClient.connect(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true});
        let db = client.db("studentDetail");
        let result = await db.collection("student").insertOne(req.body);
        res.status(200).json({ message: "record created" });
        client.close();
      } catch (error) {
        console.log(error);
        res.send(500);
      }
    });
    app.post("/assign-students", async (req, res) => {
        try {
            let {mentor,stu_list}=req.body;
            console.log(req.body)
           
          stu_list.forEach(async student=>{
            let client = await mongoClient.connect(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true});  
          let db = client.db("studentDetail");
          let result = await db.collection("student").findOneAndUpdate({name:student }, { $set:{'mentor':mentor} });
          console.log(result);
          client.close();
        })
          res.status(200).json({ message: "record updated"});
          
        } catch (error) {
          console.log(error);
          res.send(500);
        }
      });
      app.post("/change-mentor_student", async (req, res) => {
        try {
            let {mentor,stu}=req.body;
            console.log(req.body)
            let client = await mongoClient.connect(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true});  
          let db = client.db("studentDetail");
          let result = await db.collection("student").findOneAndUpdate({name:stu }, { $set:{'mentor':mentor} });
          console.log(result);
          res.status(200).json({ message: "record updated"});
          client.close();
        } catch (error) {
          console.log(error);
          res.send(500);
        }
      });
  

app.listen(port, () => console.log("Your app is running with", port));
