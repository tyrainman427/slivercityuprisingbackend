const express = require('express');
const signUpServices = require('./siginup-service');
const nodemailer = require('nodemailer');
const { requireAuth } = require('../../middleware/jwt');
//const { isAdmin } = require('../middleware/isAdmin');

const signupRouter = express.Router();

signupRouter
	.route('/')
	.all(requireAuth)
	.get((req, res, next) => {
		signUpServices
			.getAllUsers(req.app.get('db'))
			.then((users) => {
				res.json(signUpServices.serializeUsers(users));
			})
			.catch(next);
	})
	.post((req, res, next) => {
		const user = req.body;
		for (const field of [ 'full_name', 'user_name', 'password', 'email', 'phone', 'dob' ])
			if (!req.body[field])
				return res.status(400).json({
					error: `Missing '${field}' in request body`
				});
		signUpServices
			.hasUserWithUserName(req.app.get('db'), user.user_name)
			.then((user_name) => {
				if (user_name) return res.status(400).json({ error: 'User Name Already Taken' });
				return signUpServices.hashPassword(user.password).then((hashedPassword) => {
					const newUser = {
						user_name: user.user_name,
						password: hashedPassword,
						email: user.email,
						nickname: user.nickname,
						full_name: user.full_name,
						dob: user.dob,
						phone: user.phone,
						profileimg: user.profileImg,
						isactive: user.isActive,
						isvolunteer: user.isVolunteer,
						street1: user.street1,
						city: user.city,
						state: user.state,
						zipcode: user.zipcode,
						country: user.country
                    };
            let transporter = nodemailer.createTransport({
                service:'Gmail',                
                auth:{
                    user:'kidusyilma@gmail.com',
                    pass:'june2417'
                }
                
            })

            let mailOptions={
                from: 'kidusyilma@gmail.com', // sender address
                to: `${user.email}`, // list of receivers
                subject: 'Verification Email', // Subject line
                text: `Hello, ${user.full_name}`, // plain text body
                html: `<a href="http://localhost:8000/verification/true"/>`// html body
            }

            transporter.sendMail(mailOptions,(err,info)=>{
                if(err){
                    return console.log(err);
                }
                console.log(info.messageId);
            })


					return signUpServices.addUser(req.app.get('db'), newUser).then((user) => res.json(user));
				});
			})
			.catch(next);
	});

signupRouter.route('/verification/:isactive').post((req, res, next) => {
    res.send(req.params.isactive);
    
});

signupRouter
	.route('/:user_id')
	.all(requireAuth)
	.all(checkThingExists)
	.get((req, res) => {
		res.json(signUpServices.serializeUser(res.user));
	})
	.put((req, res, next) => {
		const userInfo = req.body;
		signUpServices
			.updateUser(req.app.get('db'), res.user.id, userInfo)
			.then((user) => res.send('user info has been updated'));
	})
	.delete((req, res, next) => {
		signUpServices.deleteUser(req.app.get('db'), res.user.user_id).then((user) => res.send('user deleted'));
	});

/* async/await syntax for promises */
async function checkThingExists(req, res, next) {
	try {
		const user = await signUpServices.getByUserId(req.app.get('db'), req.params.user_id);

		if (!user)
			return res.status(404).json({
				error: `User doesn't exist`
			});

		res.user = user;
		next();
	} catch (error) {
		next(error);
	}
}

module.exports = signupRouter;
