//DECLARATION
var express = require('express');
var bodyParser = require('body-parser');
var exSession = require('express-session');
var cookieParser = require('cookie-parser');
var dashboard = require.main.require('./controller/dashboard');
var product = require.main.require('./controller/product');
var productModel = require.main.require('./model/productModel');
var authentication = require.main.require('./controller/authentication');
var user = require.main.require('./controller/user');
var order = require.main.require('./controller/order');


var app = express();
var port = 3000;

var db = require.main.require('./model/db');
var orcledb = require('oracledb');

var authenticationArray = ['/auth'];


var obj = {
	title: 'index', 
	justInProduct: [] , 
	RecommendedProduct : [] , 
	cart_count : 0 

}

//CONFIGURATION
app.set('view engine' , 'ejs');



//MIDDLEWARES
app.use(exSession({secret: 'my top secret code', saveUninitialized: true, resave: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use( authenticationArray , authentication);
app.use('/dashboard' , dashboard);
app.use('/product' , product);
app.use('/user' , user);
app.use('/order' , order);


app.use('/lib/img', express.static(__dirname + '/lib/img/'));
app.use('/lib/js', express.static( __dirname + '/lib/js/'));
app.use('/lib/css', express.static( __dirname + '/lib/css/'));



//ROUTES
app.get('*' , (req, res, next)=>{

	if(req.session.email){

		obj.userinfo = req.session.userinfo;
		console.log(obj.userinfo.U_ID);
		productModel.cart_count(obj.userinfo.U_ID , function(result){
			console.log('cart count result');
			console.log(result);
			obj.cart_count = result.rows[0].CART_COUNT;
		});
		obj.loginStatus = true;

		}else{
		obj.loginStatus = false;
		}
		next();

});



app.get('/' , (req,res)=>{

	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	productModel.getRecommendedProduct(ip , function(result){
		if(result.rows.length<1){
			//console.log('recommended not found');
		}else{
			//console.log('recommended block');
			//console.log(result.rows.length);
			//console.log(result.rows);
			obj.RecommendedProduct = result.rows;
		}
	});

	productModel.getAllProduct(function(result){
		obj.justInProduct = result.rows;
		//console.log(result);

		
		obj.loginStatus = false;
		console.log(obj);
		res.render('index' , obj);
	});


}
);


//SERVER STARTUP
app.listen(port, ()=>console.log('server started at port '+port));