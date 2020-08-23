const xss = require('xss');
const bcrypt = require('bcryptjs');
const Treeize = require('treeize');

const signUpServices = {
	getAllUsers(db) {
		return db.from('users').select('*');
	},

	getByUserId(db, user_id) {        
		return signUpServices.getAllUsers(db).where('user_id', user_id).first();
	},
	hasUserWithUserName(db, user_name) {
		return signUpServices.getAllUsers(db).where('user_name', user_name).first().then((user) => !!user);
	},

	addUser(db, user) {
		return db
			.insert(user)
			.into('users')
			.returning('*')
			.then(([ user ]) => user)
			.then((user) => signUpServices.getByUserId(db, user.user_id));
	},

	deleteUser(db, user_id) {               
		return signUpServices.getAllUsers(db).where('user_id', user_id).del();
	},

	updateUser(db, user_id, userInfo) {
		return signUpServices.getAllUsers(db).where('user_id', user_id).update(userInfo);
	},

	serializeUsers(user) {       
		return user.map(this.serializeUser);
	},

	serializeUser(user) {
		const userTree = new Treeize();

		// Some light hackiness to allow for the fact that `treeize`
		// only accepts arrays of objects, and we want to use a single
		// object.
		const userData = userTree.grow([ user ]).getData()[0];

		return {
			user_id: userData.user_id,
            user_name: xss(userData.user_name),
            full_name: xss(userData.full_name),
            email: xss(userData.email),
            nickname: xss(userData.nickname),
            profilepic: xss(userData.profilepic),
			dob: xss(userData.dob),
			isActive:userData.isActive,
			isVolunteer:userData.isVolunteer,
			phone:userData.phone,
			street1:xss(userData.street1),
			city:xss(userData.city),
			state:userData.state,
			zipcode:xss(userData.zipcode),
			country:userData.country,				
			date_created: userData.date_created,
			date_modified: userData.date_modified
		};
	},
	hashPassword(password) {
		return bcrypt.hash(password, 12);
	}
};

module.exports = signUpServices;
