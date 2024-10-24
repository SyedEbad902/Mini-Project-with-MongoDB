import cookieParser from "cookie-parser";
import express from "express";
import userModel from "./models/user.js";
import postModel from "./models/post.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log("Request received at /");

  res.render("index");
});

app.post("/register", async (req, res) => {
  let { name, username, email, age, password } = req.body;

  let user = await userModel.findOne({ email: email });
  if (user) {
    return res.status(500).send("Something went wrong");
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let user = await userModel.create({
          name: name,
          username: username,
          email: email,
          age: age,
          password: hash,
        });
        let token = jwt.sign({ email: email, userid: user._id }, "shhhhh");
        res.cookie("token", token);
        res.send("Registered");
      });
    });
  }
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
