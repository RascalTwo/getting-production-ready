import path from 'path';

import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';


const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/database-name';
const DB_NAME = MONGODB_URI.split('/').at(-1).split('?')[0];


console.log(`Connecting to MongoDB "${DB_NAME}"...`)
MongoClient.connect(MONGODB_URI).then(client => {
	const db = client.db(DB_NAME);
	console.log(`Connected to MongoDB "${DB_NAME}".`);

	//#region Passport

	passport.use(new LocalStrategy((username, password, done) => {
		db.collection('users').findOne({ username }).then(user => {
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (user.password !== password) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		}).catch(err => done(err));
	}));

	passport.serializeUser((user, done) => done(null, user._id.toString()));
	passport.deserializeUser((id, done) =>
		db.collection('users').findOne({ _id: ObjectId(id) }).then(user => {
			done(null, user);
		}).catch(err => done(err))
	);

	//#endregion Passport
	//#region Express Middlewares

	const app = express();

	app.use(express.static(path.join('public')));
	app.use(express.json());
	app.use(cors({
		origin: 'http://127.0.0.1:5173',
		credentials: true,
	}));

	app.use(session({
		secret: 'secret',
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({ mongoUrl: MONGODB_URI })
	}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());

	//#endregion Express Middlewares
	//#region Auth Routes

	app.post('/api/user/login', passport.authenticate('local', { successRedirect: '/api/user', failureRedirect: '/api/user', failureFlash: true }));
	app.post('/api/user/signup', async (request, response, next) => {
		try {
			const { username, password } = request.body;
			const existingUser = await db.collection('users').findOne({ username, password });
			if (existingUser) {
				return response.json({ user: null, messages: { error: ['User already exists']} });
			}
			const user = await db.collection('users').insertOne({ username, password });
			request.login(user, (err) => {
				if (err) {
					return next(err);
				}
				return response.json({ user });
			});
		} catch (err) {
			next(err);
		}
	});

	app.get('/api/user', (request, response) =>
		response.send({
			user: request.user || null,
			messages: request.flash()
		})
	);

	//#endregion Auth Routes
	//#region Counter Routes

	app.route('/api/counter')
		.get(async (request, response, next) => {
			try {
				const counter = await db.collection('counters').findOne({ owner: ObjectId(request.user._id) });
				return response.send({ count: counter?.count ?? 0 });
			} catch (err) {
				next(err);
			}
		})
		.post(async (request, response, next) => {
			try {
				let counter = await db.collection('counters').findOne({ owner: ObjectId(request.user._id) }) || {
					_id: ObjectId(),
					count: 0
				};

				counter = (await db.collection('counters').findOneAndUpdate({ owner: ObjectId(request.user._id) }, { $set: { count: counter.count + +request.body.change } }, { upsert: true, returnDocument: 'after' })).value;

				return response.send({ count: counter.count });
			} catch (err) {
				next(err);
			}
		});

	//#endregion Counter Routes

	app.listen(PORT, () => console.log(`Listening at https://localhost:${PORT}/`));
});