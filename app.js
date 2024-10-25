import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";
import userModel from "./models/user.js";
import postModel from "./models/post.js";
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log("Request received at /");

  res.render("index");
});

app.get("/login", (req, res) => {
  console.log("Request received at /login");

  res.render("login");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.get("/profile", isLoggedin,async (req, res) => { 
  // console.log(req.user);

  let user = await userModel.findOne({ email: req.user.email }).populate('posts');
  res.render("profile", { user: user });
  
});

app.post("/post", isLoggedin, async (req, res) => { 

  let user =await userModel.findOne({email : req.user.email})
  
  let post = await postModel.create({
    user: user._id,
    content : req.body.content
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
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
        res.redirect("/login");
      });
    });
  }
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(500).send("Something went wrong");
  } else {
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = jwt.sign({ email: email, userid: user._id }, "shhhhh");
        res.cookie("token", token);
        res.status(200).redirect("profile");
      } else {
        res.redirect("/login");
      }
    });
  }
});

function isLoggedin(req, res, next) {
  if (req.cookies.token === "") {
    res.status(500).redirect("/login");
  } else {
    let data = jwt.verify(req.cookies.token, "shhhhh");
    req.user = data;
    next();
  }
}


app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
