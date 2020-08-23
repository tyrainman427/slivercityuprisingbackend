const express = require('express');
const loginService = require('./login-service');
const loginRouter = express.Router();

loginRouter.route('/').post((req, res, next) => {
	const { user_name, password } = req.body;
	const user = { user_name, password };

	for (const [ key, value ] of Object.entries(user)) {
		if (value == null)
			return res.status(400).json({
				error: `Missing '${key}' in request body`
			});
	}

	loginService
		.getUserWithUserName(req.app.get('db'), user.user_name)
		.then((dbUser) => {
			if (!dbUser)
				return res.status(400).json({
					error: 'Incorrect User Name or Password'
				});

			if(!dbUser.isactive)	{
				return res.status(400).json({
					error: 'User not active'
				});
			}
			return loginService.comparePasswords(user.password, dbUser.password).then((compareMatch) => {
				if (!compareMatch) {
					return res.status(400).json({
						error: 'Incorrect user_name or password'
					});
				}
				const sub = dbUser.user_name;
				const payload = { user_id: dbUser.user_id };
				const userInfo = {
					user_name: dbUser.user_name,
					email: dbUser.email,
					full_name: dbUser.full_name,
					nickname: dbUser.nickname,
					birthday: dbUser.birthday,
					phone: dbUser.phone,
					profileImg: dbUser.profileImg,
					street1: dbUser.street1,
					city: dbUser.city,
					state: dbUser.state,
					zipcode: dbUser.zipcode,
					country: dbUser.country,
					member_since: dbUser.date_created
				};

				res.status(201).json({
                    authToken: loginService.createJwt(sub, payload),
                    userInfo
				});
			});
		})
		.catch(next);
});

module.exports = loginRouter;
