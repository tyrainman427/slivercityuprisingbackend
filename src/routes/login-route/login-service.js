const bcrpty = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const loginService = {
	getUserWithUserName(db, user_name) {
		return db('users').where({ user_name }).first();
	},
	comparePasswords(password, hash) {
		return bcrpty.compare(password, hash);
	},
	createJwt(subject, payload) {
		return jwt.sign(payload, config.JWT_SECRET, {
			subject,
			algorithm: 'HS256'
		});
	},
	verifyJwt(token) {
		return jwt.verify(token, config.JWT_SECRET, {
			algorithms: [ 'HS256' ]
		});
	},
	
};

module.exports = loginService;