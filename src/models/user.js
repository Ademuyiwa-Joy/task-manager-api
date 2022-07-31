//middleware is used to customize the behaviour of the mongoose model


const bcrypt = require('bcryptjs');
const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Task = require('./task')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email : {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true,
		validate (value) {
			if(!validator.isEmail(value)){
				throw new Error ('E-mail is invalid!')
			}
		}
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if(value < 0){
				throw new Error ('You can only input a positive number')
			}
		}
	}, 
	password: {
		type: String,
		required: true,
		minlength: 7,	
		trim: true,
		validate (value) {
			if(value.toLowerCase().includes('password')){
				throw new Error('Your password can not be "password"')
			}
		}
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}],
	avatar: {
		type: Buffer
	}
}, {
	timestamps: true
})

//A virtual property is a relationship between two entities; not actual data stored on the database.

userSchema.virtual('myTasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password
	delete userObject.tokens

	return userObject
}

userSchema.methods.generateAuthToken = async function () {
	const user = this

	const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

	user.tokens = user.tokens.concat({token})
	await user.save()

	return token
}

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({email : email})
	if(!user){
		throw new Error('Unable to login')
	}

	const isMatch = await bcrypt.compare(password, user.password)
	if(!isMatch){
		throw new Error('Unable to login')
	}

	return user
}


//middleware for Hashing plain text password before saving
//two methods accessible to us for middleware include: pre() - for doing sth before an event; post()- after
userSchema.pre('save', async function (next) {
	const user = this //this - the individual document that is being saved
	
	if(user.isModified('password')){
		user.password = await bcrypt.hash(user.password, 8)
	}

	next() //next () tells when we are done running our code
})

//Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
	const user = this;

	await Task.deleteMany({owner: user._id})

	next()
})

const User = mongoose.model('User', userSchema) 

module.exports = User;