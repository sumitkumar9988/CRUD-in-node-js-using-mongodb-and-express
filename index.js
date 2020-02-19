const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dotenv_file = dotenv.config({ path: './config.env' });
const tourRouter = require('./tourRoutes');
//comment
//node js project
const app = express();
app.use(express.json());
if (dotenv_file.error) {
	throw dotenv_file.error;
}
const port = process.env.PORT || 3000;
const db = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then((con) => {
		console.log(con.connections);
		console.log('connection successfull');
	});

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	console.log('Hello from the middleware 👋');
	console.log(req.body);
	console.log(req.body.ratingsAverage);
	next();
});
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

app.use('/api', tourRouter);
app.use('*', (req, res, next) => {
	const err = new Error(`cant find ${req.originalUrl} on this server`);
	err.status = 'fail';
	err.statusCode = 404;
	next(err);
});
app.use((err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message
	});
});
app.listen(port, () => {
	console.log('server is running');
	console.log('at port', process.env.PORT);
});
