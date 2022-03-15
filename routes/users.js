var express = require('express');
var router = express.Router();
// var mysql = require('mysql');
const { check, validationResult } = require('express-validator');
var generator = require('generate-password');
var nodemailer = require("nodemailer");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
// var conn = mysql.createConnection({
//   host: "localhost",
//   user: "suntyjhs_salam",
//   password: "oq@S~1{!fym6",
//   database: "suntyjhs_reactnode"
// }); 
// conn.connect();
// Start with mongoose

// var contactEmail = nodemailer.createTransport({
// host: 'suntechlab.com',
// port: 465, // Port
// secure: true, // this is true as port is 465
//     auth: {
//       user: "contact@suntechlab.com",
//       pass: "_1!!A?Bg8RDi",
//     },
//   });
  
//   contactEmail.verify((error) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Ready to Send");
//     }
//   });


var Categories = require('../models/categories');
var User = require('../models/user');
var Comment = require('../models/comment');
const KEY = process.env.JWT_KEY;

router.get('/api', async (req, res) => {
var categories = await Categories.find({});
    res.json(categories);
});

router.get('/api/:id', async (req, res) => {
    var details = await Categories.findOne({_id:req.params.id});
    res.json(details);
});

// router.post("/contact",
// [
//   check('first_name').not().isEmpty().withMessage('required').
//   matches(/^[a-zA-Z-' ]*$/).withMessage('Only letters and white space allowed')
//   .isLength({ min: 3, max: 50 })
//   .withMessage('must be at least 3 chars long'),
//   check('last_name').not().isEmpty().withMessage('Last name is required').
//   matches(/^[a-zA-Z-' ]*$/).withMessage('Only letters and white space allowed')
//   .isLength({ min: 3, max: 50 })
//   .withMessage('must be at least 3 chars long'),
//   check('email').not().isEmpty().withMessage('Email is required').isEmail().normalizeEmail()
//   .withMessage('Email address not valid')
//   .isLength({ min: 10, max: 100 })
//   .withMessage('must be at least 10 chars long'),
//   check('message').not().isEmpty().withMessage('Please type your message')
//     .isLength({ min: 5 })
//     .withMessage('must be at least 5 chars long'),
//     check('checkbox').not().isEmpty().withMessage('Must be select the checkbox')
// ], (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       // res.json(errors)
//       res.json({ errors: errors.array()})
//   }else{
//     const name = req.body.first_name+" "+req.body.last_name;
//     const email = req.body.email;
//     const company = req.body.company;
//     const phone = req.body.phone;
//     const message = req.body.message; 
//     const mail = {
//       from: "Suntech Lab "+"contact@suntechlab.com",
//       to: "salamsl75m@gmail.com",
//       subject: "Contact Form Message",
//       html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Company: ${company}</p><p>Phone: ${phone}</p><p>Message: ${message}</p>`,
//     };
//     contactEmail.sendMail(mail, (error) => {
//       if (error) {
//         res.json({ status: "failed" });
//       } else {
//         res.json({ status: "sent" });
//       }
//     });  
//   }
//   });

router.get('/:email',async (req, res) => {
     var email = req.params.email
      var user = await User.findOne({ email:email });
        if (user) {
        res.json({status:'success'});
        }else{
        res.json({status:'failed'})
        }
});
router.post('/signup',
[
  check('name').not().isEmpty().withMessage('required').
  matches(/^[a-zA-Z-' ]*$/).withMessage('Only letters and white space allowed')
  .isLength({ min: 3, max: 50 })
  .withMessage('must be at least 3 chars long'),
  check('email').not().isEmpty().withMessage('Email is required').isEmail().normalizeEmail()
  .withMessage('Email address not valid')
  .isLength({ min: 10, max: 100 })
  .withMessage('must be at least 10 chars long').custom(value => {
    return User.findOne({ email:value }).then(user => {
      if (user) {
        return Promise.reject('Email address already registered');
      }
    });
  }),
  check('password')
    .isLength({ min: 5 })
    .withMessage('must be at least 5 chars long')
    .matches(/\d/)
    .withMessage('must contain a number')
    .matches(/[A-Z]+/)
    .withMessage('Must Contain At Least 1 Capital Letter!')
    .matches(/[a-z]+/)
    .withMessage('Must Contain At Least 1 small Letter!')
    .matches(/[!@#$%^&*?_~]{1,}/)
    .withMessage('Must Contain At Least 1 special characters'),
  check('confirmPassword').custom((value, {req}) => {
    if(value !== req.body.password){
      throw new Error("Password do not match")
    }
    return true
  }),
  check('checkbox').not().isEmpty().withMessage('Must be select the checkbox')
],async (req, res) => {
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // res.json(errors)
      res.json({ errors: errors.array()})
  }else{
      var user = await User.findOne({ email: req.body.email });
  var hashedPassword = await bcrypt.hash(req.body.password, 10);
      var randomNo = generator.generate({
      length: 50,
      numbers: true
    });
    var link="https://"+req.get('host')+"/users/verify/"+randomNo;
  if (user) {
      res.json({status:'That user already exisits!'});
  } else {
      user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          secret: randomNo,
          active: false
      });
      await user.save();
    const mail = {
      from: "Suntech Lab "+"contact@suntechlab.com",
      to: req.body.email,
      subject: "Contact Form Message",
      html: `<p>Name: ${link}</p><p>Email: ${req.body.email}</p>`,
    };
    contactEmail.sendMail(mail, (error) => {
      if (error) {
        res.json({ status: "failed" });
      } else {
        res.json({ status: "sent" });
      }
    });
  }  
  }
});

router.get('/verify/:secret', async (req, res) => {
  var secretNo = req.params.secret
  var user = await User.findOne({ secret: secretNo});
  if(user){
  res.json(user)
  }
});
router.post('/verify/:secret', async (req, res) => {
  var secretNo = req.params.secret;
  await User.updateOne(
    { _id: secretNo },
    { $set: { active: true } },
    { new: true }
  );
  res.json({status:'success'})
});


router.post("/signin",async (req, res) => {
        const { email, password } = req.body;
        var user = await User.findOne({ email: email });
        
        if(user){
            if(user.active=='true'){
            bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
              const payload = {
                id: user.name,
                email: user.email,
                createdAt: user.password,
              };
              jwt.sign(
                payload,
                KEY,
                {
                  expiresIn: 31556926,
                },
                (err, token) => {
                  res.status(200).json({
                    success: true,
                    token: 'Suntechlab ' + token,
                  });
                },
              );
            } else {
              res.json({ status: 'passwordError', error: 'Password incorrect' });
            }
          });
            }else{
              res.json({ status: 'emailError', error: 'Please verify your email' });  
            }
        }else{
          res.json({ status: 'emailError', error: 'User not found' });
        }

  
});



router.post('/comment/add',
[
  check('name').not().isEmpty().withMessage('Name is required').
  matches(/^[a-zA-Z-' ]*$/).withMessage('Only letters and white space allowed'),
  check('email').not().isEmpty().withMessage('Email is required').isEmail().normalizeEmail()
  .withMessage('Email address not valid'),
  check('message').not().isEmpty().withMessage('Please type something')
],async (req, res) => {
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // res.json(errors)
      res.json({ errors: errors.array()})
  }else{
  var user = await User.findOne({ email: req.body.email });
  if (user) {
      
    const commentObj ={
      name: req.body.name,
      email: req.body.email,
      blogId: req.body.blogId,
      slug: req.body.slug,
      website: req.body.website,
      message: req.body.message
    }
    if(req.body.commentId && req.body.commentId !="undefined"){
      commentObj.commentId = req.body.commentId
    }
    comment = new Comment(commentObj);
      await comment.save();
      res.json({status:'success'});
  } else {
    res.json({status: 'emailError', msg: 'You need to signup at first'})
  }
  }
});

// router.get('/comments/all', async (req, res) => {
//   var result = await Comment.find({});
//   if (!result) {
//       return res.status(400).send('Comments not found');
//   }
//   res.json(result);
// });
router.get('/comments/all', async (req, res) => {
    function createCategory(allCategory, commentId = null){
        const categoryList = [];
        if(commentId == null){
          var category = allCategory.filter(cat => cat.commentId == undefined)
        }else{
          var category = allCategory.filter(cat => cat.commentId == commentId)
        }
        for(let cate of category){
          categoryList.push({
            _id:cate._id,
            name:cate.name,
            slug:cate.slug,
            children:createCategory(allCategory, cate._id)
          })
        }
        return categoryList;
      }

    var categories = await Comment.find({});
    const categoryList = createCategory(categories);
    res.json(categoryList);
});
router.get('/comments/:id', async (req, res) => {
    var id = req.params.id
    function createCategory(allCategory, commentId = null){
        const categoryList = [];
        if(commentId == null){
          var category = allCategory.filter(cat => cat.commentId == undefined)
        }else{
          var category = allCategory.filter(cat => cat.commentId == commentId)
        }
        for(let cate of category){
          categoryList.push({
            _id:cate._id,
            name:cate.name,
            slug:cate.slug,
            message:cate.message,
            children:createCategory(allCategory, cate._id)
          })
        }
        return categoryList;
      }

    var categories = await Comment.find({slug: id});
    const categoryList = createCategory(categories);
    res.json(categoryList);
});


// router.get('/comments/:id', async (req, res) => {
//   var id = req.params.id
//   var result = await Comment.find({slug: id});
//   if (!result) {
//       return res.status(400).send('Comments not found');
//   }
//   res.json(result);
// });
// End the mongoose

// router.get('/form', function(req, res, next) { 
// res.render('users-form'); 
// });

// router.get('/login', function(req, res, next) { 
// if(req.session.email){
//     res.redirect('/');
// }else{
//  res.render('login');  
// }
// });

// router.post("/loginvv", function(req, res, next) {
//   var email = req.body.email;
//   req.session.email = email;
//   res.send(req.session.email);

  
// });
// router.post("/login", function(req, res, next) {
//   var email = req.body.email;
//   var sql = "SELECT * FROM user_info WHERE email = '"+ email +"'";
//   conn.query(sql, function (err, result) {
//     if (err) throw err;
//     req.session.email = result[0].email;
//     res.redirect('/users/login');
//   });
  
// });
// router.post("/form", function(req, res, next) {
//   var name = req.body.name;
//   var email = req.body.email;
//   var city = req.body.city;
//   var country = req.body.country;
//   var sql = "INSERT INTO user_info (name, email, city, country) VALUES ('"+ name +"', '"+ email +"', '"+ city +"', '"+ country +"')";
//   conn.query(sql, function (err, result) {
//     res.send("1 Document inserted");
//   });
//   res.redirect('/users/form');
// });

// router.get("/user-list", function(req, res, next) {
//   var sql = "SELECT * FROM user_info";
//   conn.query(sql, function (err, result) {
//   res.render('user-list', { title: 'User List', userData: result});
//   });
// });

// router.get("/session", function(req, res, next) {
//     req.session.name = "suntechlab";
//     res.send(req.session.name)
// });
// router.get("/test", function(req, res, next) {
//     if(req.session.email){
//     res.send(req.session.email)
//     }else{
//         res.send("failed")
//     }
// });


// router.get("/delete/:id", function(req, res, next) {
//   var id= req.params.id;
//   var sql = "DELETE FROM user_info WHERE id = ?";
//   conn.query(sql, [id], function (err, result) {
  
//   });
//   res.redirect('/users/user-list');
// });


// router.get("/edit/:id", function(req, res, next) {
//   var id= req.params.id;
//   var sql = "SELECT * FROM user_info WHERE id = '"+ id +"'";
//   conn.query(sql, function (err, result) {
//   res.render('users-form', { title: 'Update User', editData: result[0]});
//   });
// });

// router.post('/edit/:id', function(req, res, next) {
//     var id= req.params.id;
//     var updateData=req.body;
//     var sql = "UPDATE user_info SET ? WHERE id= ?";
//     conn.query(sql, [updateData, id], function (err, result) {
        
//   });
//   res.redirect('/users/user-list');
// });

module.exports = router;