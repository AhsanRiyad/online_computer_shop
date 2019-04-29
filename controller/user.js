var express = require('express');


var router = express.Router();
var userModel = require.main.require('./model/userModel');

var obj = {
	title: 'add product' ,
	msg: '',
	promoArray: ['far' , 'faerf'],
	userinfo: [{ last_name: 'Riyad' }],
	loginStatus: false,
	cart_count: 0
}



router.get('/addUser' , function(req, res){

	//obj.msg = 'none';
	if(req.session.email == null){
		res.redirect('/auth');
	}else{
		obj.userinfo = req.session.userinfo;
		res.render('user/addUser' , obj);
	}

	
});





router.post('/addUser' , function(req, res){
	obj.userinfo = req.session.userinfo;
	obj.msg = 'none';
	if(req.session.email == null){
		res.redirect('/auth');
	}
	else if(req.body.user_name == '' || req.body.user_password == '' || req.body.user_email == '' || req.body.user_mobile == '' || req.body.user_type == '' || req.body.user_status == '')
	{
		obj.msg = 'null';
		res.render('user/addUser' , obj);
	}
	else{
		

		var userFormInfo = {
			user_name: req.body.user_name,
			user_password : req.body.user_password,
			user_email: req.body.user_email,
			user_mobile: req.body.user_mobile,
			user_type: req.body.user_type,
			user_status: req.body.user_status
		}


		console.log(userFormInfo);
		//return;

		userModel.addUser(userFormInfo , function(status){
			if(status){
				obj.msg = 'added';
				console.log('add user block ');
				console.log(userFormInfo);

				res.render('user/addUser' , obj);
			}
			else{
				obj.msg = 'db';
				res.render('user/addUser' , obj);
			}
		} );

	}


	
});



router.get('/viewuser' , function(req, res){

	if(req.session.email == null){
		res.redirect('/auth');
	}

	obj.userinfo = req.session.userinfo;
	userModel.viewUser(function(result){
		console.log('view user section');
		console.log(result.rows);

		// return;
		obj.userArray = result.rows;
		console.log(obj.userArray);
		res.render('user/viewuser' , obj);
	});
	
});



// trigger controller starts

router.get('/view_trigger' , function(req, res){

	if(req.session.email == null){
		res.redirect('/auth');
	}

	obj.userinfo = req.session.userinfo;
	userModel.viewTrigger(function(result){
		console.log('view user section');
		console.log(result.rows);

		// return;
		//obj.userArray = result.rows;
		obj.trigger_status = req.session.trigger_status; 
		obj.triggerArray = result.rows;
		req.session.trigger_status = '';
		console.log(obj.triggerArray);
		res.render('user/viewTrigger' , obj);
	});
	
});


router.get('/custom_trigger' , function(req, res){

	if(req.session.email == null){
		res.redirect('/auth');
	}

	obj.userinfo = req.session.userinfo;
	userModel.viewTrigger(function(result){
		console.log('view user section');
		console.log(result.rows);

		// return;
		//obj.userArray = result.rows;
		obj.trigger_status = req.session.trigger_status; 
		obj.triggerArray = result.rows;
		req.session.trigger_status = '';
		console.log(obj.triggerArray);
		res.render('user/customTrigger' , obj);
	});
	
});




router.post('/custom_trigger' , function(req, res){

	if(req.session.email == null){
		res.redirect('/auth');
	}

	var table_name = req.body.table_name;
	var start_time = req.body.start_time;
	var end_time = req.body.end_time;

	console.log(table_name);
	//return;
	obj.userinfo = req.session.userinfo;
	userModel.customTrigger(table_name ,start_time , end_time , function(result){
		console.log('view user section');
		console.log(result);

		 return;
		//obj.userArray = result.rows;
		req.session.trigger_status = 'trigger created successfully'; 
		obj.triggerArray = result.rows;
		//req.session.trigger_status = '';
		console.log(obj.triggerArray);
		res.redirect('/user/custom_trigger');
	});
	
});






// trigger controller ends






router.post('/enableTrigger' , function(req, res){
	console.log('enableTrigger');
	
	var triggerName = req.body.enableTrigger;
	//obj.userinfo = req.session.userinfo;
	userModel.enableTrigger(triggerName , function(status){
		
		userModel.viewUser(function(result){
			req.session.trigger_status = 'Trigger Enabled';
			res.redirect('/user/view_trigger');
		});

	})


});





router.post('/disableTrigger' , function(req, res){
	console.log('disableTrigger');
	
	var triggerName = req.body.disableTrigger;
	//obj.userinfo = req.session.userinfo;
	userModel.disableTrigger(triggerName , function(status){
		
		userModel.viewUser(function(result){
			req.session.trigger_status = 'Trigger Disabled';
			res.redirect('/user/view_trigger');
		});

	})


});







router.get('/view_log_user' , function(req, res){

	if(req.session.email == null){
		res.redirect('/auth');
	}

	obj.userinfo = req.session.userinfo;
	userModel.view_log_user(function(result){
		console.log('view user section');
		console.log(result.rows);

		// return;
		//obj.userArray = result.rows;
		obj.trigger_status = req.session.trigger_status; 
		obj.triggerArray = result.rows;
		req.session.trigger_status = '';
		console.log(obj.triggerArray);
		res.render('user/view_log_user' , obj);
	});
	
});








router.post('/deleteuser' , function(req, res){
	console.log('delete promo');
	
	var userid = req.body.userIdDelete;
	obj.userinfo = req.session.userinfo;
	userModel.deleteuser(userid , function(status){
		
		userModel.viewUser(function(result){
			console.log('view user section');
			console.log(result.length);
			obj.userArray = result;
			console.log(obj.userArray);
			res.render('user/viewuser' , obj);
		});

	})


});

router.get('/updateuser/:userid' , function(req, res){
	
	if(req.session.email == null){

		res.redirect('/auth');
	}else{
		obj.userinfo = req.session.userinfo;
		var userid = req.params.userid;
		console.log(userid);
		obj.userid = userid;

		res.render('user/updateuser' , obj);
	}

	

});


router.post('/updateuser/:userid' , function(req, res){
	obj.userinfo = req.session.userinfo;
	obj.msg = 'none';
	if(req.session.email == null){
		res.redirect('/auth');
	}else 
	{
	var u_id = req.params.userid;
	if(req.body.user_name == '' || req.body.user_password == '' || req.body.user_email == '' || req.body.user_mobile == '' || req.body.user_type == '' || req.body.user_status == '')
	{
		obj.msg = 'null';
		res.render('user/updateuser' , obj);
	}
	else{
		

		var userFormInfo = {
			user_name: req.body.user_name,
			user_password : req.body.user_password,
			user_email: req.body.user_email,
			user_mobile: req.body.user_mobile,
			user_type: req.body.user_type,
			user_status: req.body.user_status,
			user_id: u_id
		}


		console.log(userFormInfo);
		//return;

		userModel.updateuser(userFormInfo , function(status){
			if(status){
				obj.msg = 'added';
				console.log('add user block ');
				console.log(userFormInfo);

				res.render('user/updateuser' , obj);
			}
			else{
				obj.msg = 'db';
				res.render('user/updateuser' , obj);
			}
		} );

	}

}
	
});






module.exports = router;