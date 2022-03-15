const express = require("express");
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
var Blogs = require('../models/blogs');
var Products = require('../models/products');
var Categories = require('../models/categories');
/**
 * GET product list.
 *
 * @return product list | empty.
 */
router.get("/", async (req, res) => {
  try {
    res.json({
      status: 200,
      message: "Get data has successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/images/blog-images',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});


router.post("/add",upload.array('image', 5), async (req, res) => {
    //     var proimages=[];
    //     for(var i=0; i<req.files.length; i++){
    //         proimages.push(req.files[i].filename);
    //     }
    // res.json(req.body)
    
  var product = await Products.findOne({title: req.body.title});
  var category = await Categories.find({});
  res.json(category)
  if(product){
    return res.status(400).send('The product already added');
  }else{
    var proimages=[];
    for(var i=0; i<req.files.length; i++){
        proimages.push(req.files[i].filename);
    }
    product = new Products({
      title: req.body.title,
      price: req.body.price,
      procategory: req.body.procategory,
      subcategory: req.body.subcategory,
      path:category.path,
      description: req.body.description,
      image: proimages,
      time: Date.now().toString()
  });
  await product.save();
  }
  });
// End the mongoose

router.post("/add-new-blog",upload.array('image', 5), async (req, res) => {
        var proimages=[];
        const d = new Date();
        for(var i=0; i<req.files.length; i++){
            proimages.push(req.files[i].filename);
        }
        blogs = new Blogs({
        title: req.body.title,
        slug: req.body.slug,
        shortDescription: req.body.shortDescription,
        demoLink: req.body.demoLink,
        content: req.body.content,
        aInfo: req.body.aInfo,
        image: proimages,
        time: d.toDateString()
        });
        await blogs.save();
        res.json({status:'success', msg:'Blog saved successfully'})
  });
router.get('/allblogs', async (req, res) => {
  var result = await Blogs.find({});
  if (!result) {
      return res.status(400).send('Blog not found');
  }
  res.json(result);
});

router.get('/:id', async (req, res) => {
  var id = req.params.id
  var result = await Blogs.findOne({slug: id});
  if (!result) {
      res.json({notFound:true});
  }
  res.json(result);
});

router.post('/update/:id',upload.array('image', 5), async (req, res) => {
  var id = req.params.id
  var proimages=[];
  var myFile = req.files
  if(myFile.length > 0){
    for(i=0; i<myFile.length; i++){
      proimages.push(myFile[i].filename);
  }
  var result = await Blogs.findOne({_id: id});
    for (i=0; i<result.image.length; i++) {
      fs.unlink('public/images/blog-images/'+result.image[i], function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
    }
  }else{
    var result = await Blogs.findOne({_id: id});
    for (i=0; i<result.image.length; i++) {
      proimages.push(result.image[i]);
    }
  }

  await Blogs.updateOne(
    { _id: id },
    { $set: { title: req.body.title, slug: req.body.slug, shortDescription: req.body.shortDescription, demoLink: req.body.demoLink, content: req.body.content,aInfo:req.body.aInfo, image: proimages, time: Date.now().toString()} },
    { new: true }
  );
  res.json("Blog update successfully")
});

router.post('/delete/:id', async (req, res) => {
  var id = req.params.id
  var result = await Blogs.findOne({_id: id});
    for (i=0; i<result.image.length; i++) {
      fs.unlink('public/images/blog-images/'+result.image[i], function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
    }

  await Blogs.findOneAndRemove({ _id: id });
  res.json("Blog delete successfully")
});
module.exports = router;
