require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const bodyParser = require('body-parser');

//routes
const loginRoute = require('./routes/login-route/login-route');
const signupRoute = require('./routes/signup-route/siginup-route');
const contactUsRoute = require('./routes/contact-route/contact-route');

const app = express();

app.use(
	morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
		skip: () => NODE_ENV === 'test'
	})
);
app.use(cors());
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes middleware

app.use('/api/login', loginRoute);
app.use('/api/users/signup', signupRoute);
app.use('/api/contact', contactUsRoute)

//error handling middleware
app.use(function errorHandler(error, req, res, next) {
	let response;
	if (NODE_ENV === 'production') {
		response = { error: 'Server error' };
	} else {
		console.error(error);
		response = { error: error.message, object: error };
	}
	res.status(500).json(response);
});

module.exports = app;
