var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passportTwitter = require('../auth/twitter');
var multer = require('multer');
var upload = multer();
var middleware = {
    querryTheDB: function(req, res, next){
    User.find({ },'images someID', function (err, docs) {
    if (err) console.log(err);
    var container=[]; 
    docs.forEach(function(elem){
       elem.images.forEach(function(image){
          var newImage={
            "imageUploader": elem.someID,
            "avatar"       : image.avatar,
            "description"  : image.description,
            "imageAdress"  : image.imageAdress,
            "_id"          : image._id       
          }    
           container.push(newImage); 
        })
       });
//    Due to the asynchronous access to the db if the following 3 lines 
//    are outside of User.find function, newCont will be empty 
    var newCont = container;
    if(!res.locals.partials) res.locals.partials = {};  
    res.locals.partials.imageContext =  newCont;
    next(); 
    })
     },
    
    getSpecificUserPhotos : function(req, res, next){
    User.find({someID:req.user.someID},'images',function (err, docs){
        if (err) console.log(err);
        var container=[];
        docs.forEach(function(elem){
        container.push(elem.images );
    });
        if(!res.locals.partials) res.locals.partials = {};
        res.locals.partials.imageUserContext =  container[0];
        next();
    })
    },
    isLoggedIn:function(req,res,next){
        if (req.isAuthenticated()){
            res.render('userHome');          
        }
        else {res.render('home')}
    },
    isLoggedInGen:function(req,res,next){
        if (req.isAuthenticated()){
            return next();          
        }
        else {res.redirect('/')}
    }    
}

router.get('/auth/twitter', passportTwitter.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login' }), 
                
  function(req, res) {
    // Successful authentication
    res.redirect('/');
  });

router.get('/login', function(req, res, next) {
   res.send('LOGGING IN WITH TWITTER FAILED')
});

router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

//req.user is always available for a logged in user and this functionality comes from  init.js
router.get('/', middleware.querryTheDB,middleware.isLoggedIn
          );

router.post('/',middleware.isLoggedInGen,upload.array(), function (req, res) {
    var url = req.body.imageUrl;
    User.findOneAndUpdate({someID:req.user.someID},{$push:{"images":{imageAdress:req.body.imageUrl, description: req.body.description, avatar:req.user.avatar} }}, {safe: true, upsert: true, new : true}, function(err, model) {
            if (err)  {console.log(err)}
            else {res.redirect('/')}
        })
});

router.get('/myPics',middleware.isLoggedInGen,middleware.getSpecificUserPhotos, function(req,res){
    res.render('userMyPics');
});

router.post('/myPics',middleware.isLoggedInGen,upload.array(), function (req, res) {
    var url = req.body.imageUrl;
    User.findOneAndUpdate({someID:req.user.someID},{$push:{"images":{imageAdress:req.body.imageUrl, description: req.body.description, avatar:req.user.avatar} }}, {safe: true, upsert: true, new : true}, function(err, model) {
            if (err)  {console.log(err)}
            else {res.redirect('/myPics')}
        })
});

//DELETE /images/:id
router.post('/del/:id', function(req,res){
        User.findOneAndUpdate({someID:req.user.someID},{$pull:{"images":{_id:req.params.id} }}, {safe: true, upsert: true, new : true}, function(err, model) {
            if (err)  {console.log(err)}
            else {res.redirect('/myPics')}
        })
                           
});


module.exports = router;
