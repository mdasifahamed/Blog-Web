//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const mongoose = require('mongoose');


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
let url = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/BlogDB'); // coonecting the database with name called Blogdb with the local machine

const blogschema = { // creating Schema/collection for blogposts in the database
  Tittle: String,
  Post: String
};
const BlogPost = mongoose.model("BlogPost", blogschema); // creating model to push data to tha schema /collections in the database

app.get('/', function(req, res) {
  BlogPost.find({}, function(err, foundposts) { // monggose find method to display blogpost in the home screen this find method comes from database moudule
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        StartingContent: homeStartingContent,
        postsT: foundposts
      })
    }
  })

})
app.get('/about', function(req, res) {
  res.render("about", {
    aContent: aboutContent
  })
})
app.get('/contact', function(req, res) {
  res.render("contact", {
    cContent: contactContent
  })
})
app.get('/home', function(req, res) {
  res.redirect("/")
})
app.get('/compose', function(req, res) {

  res.render('compose')
})


app.post('/compose', function(req, res) { // Getiing user input from the page
  let post_name = req.body.postTittle; // storing tittle to a variable
  let post = req.body.postBody; // storing bogpost to a variable comes from user input
  const post1 = new BlogPost({ // creating objects of database model from the schema created to stored user blog tittle and blog post
    Tittle: post_name,
    Post: post,
  });
  post1.save(); // saving the post to the database
  res.redirect("/"); // after saving from the compose when the publish button is pressed it will redirect to the home rout and display the post
})
app.get("/posts/:postID", function(req, res) { // readmore options will useed here 
  const requestedPostID = req.params.postID;
  BlogPost.findOne({
    _id: requestedPostID
  }, function(err, post) {
    if (!err) {
      res.render("post", {
        tittle: post.Tittle,
        body: post.Post
      })
    } else {
      res.redirect("/")
    }
  })


})









app.listen(3000, function() {
  console.log("Server started on port 3000");
});
