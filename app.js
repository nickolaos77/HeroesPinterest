var express         = require('express'),
    app             = express(),
    multer          = require('multer'),
    mongoose        = require('mongoose'),
    upload          = multer(),
    passport        = require('passport'),
    bodyParser      = require('body-parser'),
    session         = require('express-session'),
    MongoStore      = require('connect-mongo')(session),
    passportTwitter = require('./auth/twitter'),
    User            = require('./models/user'),
    PORT            = process.env.PORT || 3000,
    url             = process.env.MONGOLAB_URI,
    routes          = require('./routes/index.js');
 
var handlebars      = require('express-handlebars').create({
        defaultLayout: 'main',
        helpers:{
            section:function(name,options){
                if(!this._sections) this._sections ={};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });

mongoose.connect(url);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({
  secret: 'The sun is cloudy',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ url: process.env.MONGOLAB_URI })
}));
app.use(passport.initialize());
app.use(passport.session());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(routes);
app.use(express.static(__dirname+ '/public'));
// the router.all('*',function(req,res){}) in the index file didn't work as expected
// to redirect all unhandled requests to the root
app.use('*', function (req, res, next) {
    res.redirect('/')
});

//catch all invalid urls to protect from database injections route ('/') catch all verbs
app.listen(PORT, function(){
    console.log('Express listening on port '+ PORT + '!');
});

/*
--  Links - Bibliograply - Notes  for the entire project--

1.http://mherman.org/blog/2015/09/26/social-authentication-in-node-dot-js-with-passport/#.V_IC_ih9601
2.http://stackoverflow.com/questions/15621970/pushing-object-into-array-schema-in-mongoose
3.OReilly.Web.Development.With.Node.And.Express
4.http://stackoverflow.com/questions/9784793/chrome-is-stretching-the-height-of-my-max-width-image
5.http://stackoverflow.com/questions/92720/jquery-javascript-to-replace-broken-images
6.http://stackoverflow.com/questions/2701041/how-to-set-form-action-through-javascript

    ------      Notes        --------
    
1.The links to the images have as default root the public folder
*/
