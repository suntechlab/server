var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.send('Home page')
});
/* Draft*/
router.get('/main', function(req, res, next) {
  res.render('main', { title: 'Express',title1: 'ExpressOne' });
});

// define the about route
router.get('/about', function (req, res) {
  res.send('About')
})

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/')
})
router.get('/contact', function (req, res) {
    if(req.session.email){
       res.render('contact', { user: req.session.email }); 
    }else{
        res.render('contact', { user: "" });
    }
})

module.exports = router;
