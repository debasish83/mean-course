// manage all the routes in a separate file like posts.js
const express = require("express");
const multer = require("multer");
const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mile type");
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

//multer middleware is trying to extract single file from the image property in the body
//{storage: multer.diskStorage should be a javascript object}
router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
// construct an url for the server so that we can save the s3 or wasabi or ipfs filesystem location
  const url = req.protocol + "://" + req.get("host");

  //Use database to save the posts we made
//for now pull the data from the angular app and write it to post API
//for post request there is a data attached to it
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost => {
    console.log(createdPost);
    //200 everything is ok
    //201 everything is ok but new resource is added
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  })
})

//for update we can either use a put or patch request
router.put("/:id", multer({storage: storage}).single("image"),
(req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  })
  console.log(post);
  Post.updateOne({_id:req.params.id}, post).then(result => {
    res.status(200).json({message: "Update succesful"})
  })
});

// /api/posts can be reached from here and rest of the calls will go to void
// in place of app.use we can use app.get and that will ensure only get requests show up over here

// In the initial impl we are pulling all the documents from the backend
// Now we will use query params to fetch appropriate number of posts
router.get("", (req, res, next) => {
  //We want to show the real data, we can get all posts OR we can get a specific post based on a id
  //find will return all entry but we can configure it to narrow down result per id

  // by default req.query.pagesize and req.query.page are strings, we need to convert it to numeric
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  console.log('pageSize ' + pageSize + ' currentPage ' + currentPage);
  // check if the API are setting these up
  if (pageSize && currentPage) {
    // MongoDB/Mongoose support the pagination operation using skip
    // check if node.js mysql driver also support pagination operator
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize); // if the data is extremely large limit may get into issues
  }
  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    console.log('posts in mongo ' + count)
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: fetchedPosts,
      maxPosts: count
    })
    console.log(fetchedPosts)
  })

  // Used for building UI
  // const posts = [
  //   {
  //     id: 'id1',
  //     title: 'first server side post',
  //     content: 'This is coming from server'
  //   },
  //   {
  //     id: 'id2',
  //     title: 'Second server side post',
  //     content: 'This is coming from the server'
  //   }
  // ];

  // There is no next() middleware in this case
  // console.log('First middleware');
  // next();
})

//find an element using the id using the Post.findById call to the database model
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    console.log('fetching post ' + req.params.id)
    if (post) {
      res.status(200).json(post)
    } else {
      req.status(404).json({message: 'Post not found'});
    }
  })
})

//id will be extracted by express and it will be dynamically populated
router.delete("/:id", (req, res, next) => {
  //req.params extract all the identifier like id from :id
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result)
    res.status(200).json({message: "Post deleted !" + req.params.id})
  })
})

module.exports = router;
