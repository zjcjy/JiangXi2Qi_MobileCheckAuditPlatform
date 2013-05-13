
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes/routes')
    , http = require('http')
    , path = require('path')
    , flash = require('connect-flash')
    , partials = require('express-partials')
    , settings = require('./settings');
var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(partials());
app.use(express.cookieParser());
app.use(flash());
app.use(express.session({
    secret : settings.cookie_secret,
    cookie : {
        maxAge : 60000 * 20	//20 minutes
    }         //    store : sessionStore
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')))
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
routes(app);
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
