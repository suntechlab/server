var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
// Start with mongoose
var Products = require('../models/products');
var Categories = require('../models/categories');
var Projects = require('../models/projects');


const upload = multer({
  storage: multer.diskStorage({
    destination: './public/images/product-images',
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

router.post("/add-new-project",upload.array('image', 5), async (req, res) => {
        var proimages=[];
        for(var i=0; i<req.files.length; i++){
            proimages.push(req.files[i].filename);
        }
        projects = new Projects({
        title: req.body.title,
        slug: req.body.slug,
        shortDescription: req.body.shortDescription,
        demoLink: req.body.demoLink,
        content: req.body.content,
        image: proimages,
        time: Date.now().toString()
        });
        await projects.save();
        res.json("Project saved successfully")
  });
router.get('/allprojects', async (req, res) => {
  var result = await Projects.find({});
  if (!result) {
      return res.status(400).send('Products not found');
  }
  res.json(result);
});

router.get('/:id', async (req, res) => {
  var id = req.params.id
  var result = await Projects.findOne({slug: id});
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
  var result = await Projects.findOne({_id: id});
    for (i=0; i<result.image.length; i++) {
      fs.unlink('public/images/product-images/'+result.image[i], function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
    }
  }else{
    var result = await Projects.findOne({_id: id});
    for (i=0; i<result.image.length; i++) {
      proimages.push(result.image[i]);
    }
  }

  await Projects.updateOne(
    { _id: id },
    { $set: { title: req.body.title, slug: req.body.slug, shortDescription: req.body.shortDescription, demoLink: req.body.demoLink, content: req.body.content, image: proimages, time: Date.now().toString()} },
    { new: true }
  );
  res.json("Project update successfully")
});

router.post('/delete/:id', async (req, res) => {
  var id = req.params.id
  var result = await Projects.findOne({_id: id});
    for (i=0; i<result.image.length; i++) {
      fs.unlink('public/images/product-images/'+result.image[i], function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
    }

  await Projects.findOneAndRemove({ _id: id });
  res.json("Project delete successfully")
});
module.exports = router;
