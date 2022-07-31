const express = require('express');
const router = new express.Router();
const User = require('../models/user.js')
const auth = require('../middleware/auth')
const multer = require('multer');
const sharp = require('sharp');
//const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')

router.get('/users/me', auth, async (req, res) => { //fetching user
	res.send(req.user)
})


router.post('/users', async (req, res) => {
	
	const user = new User(req.body)
	// user.save().then(() => {
	// 	res.status(201).send(user) //created
	// }).catch((e) => {
	// 	res.status(400).send(e) //Bad request
	// })

	//Using async functionality
	try{
		await user.save()
		//sendWelcomeEmail(user.email,user.name)
		const token = await user.generateAuthToken()
																// await user.save().then((user) => {							
	
		res.status(201).send({user, token})								// 	res.status(201).send(user)
	} catch(e) {												// }).catch((e) => {
		res.status(400).send(e)									// 	res.status(400).send()
	}															// })
	
})

router.post('/users/login', async (req, res) => {
	try{
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		
		res.send({user, token})
	}catch(e){
		res.status(400).send()
	}
})

//patch http method or PUT; designed for updating an existing resource.

router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'age','email', 'password'];
	const isValidOperation = updates.every((update) => {
		return allowedUpdates.includes(update)
	})

	if(!isValidOperation){
		return res.status(400).send({error: 'Invalid updates!'})
	}

	try {
		updates.forEach((update) => {
			return req.user[update] = req.body[update] 
		});

		await req.user.save();
		res.send(req.user)
		//const user = await User.findByIdAndUpdate(req.params.userId, req.body, {new : true, runValidators: true})
		// if(!user){
		// 	return res.status(404).send('User not found!')
		// }
		//res.send(req.user)
	}catch (e) {
		res.status(400).send(e)
	}
})

router.delete('/users/me', auth, async (req, res) => {
	try {
		// const user = await User.findByIdAndDelete(req.user._id)
		// if(!user){
		// 	return	res.status(404).send('User not found!')
		// }

		await req.user.remove()
		//sendCancelationEmail(req.user.email, req.user.name)
		res.send(req.user)
	}catch(e){
		res.status(500).send()
	}
})

router.post('/users/logout', auth, async (req, res) => {
	try{
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token
		})
		await req.user.save()

		res.send()
	}catch(e){
		res.status(500).send()
	}
})

router.post('/users/logoutAll', auth, async (req, res) => {
	try{
		req.user.tokens = []

		await req.user.save()
		res.send()
	}catch(e){
		res.status(500).send()
	}
})

const upload = multer({
	//dest: 'avatar', //destination directory
	limits: {
		fileSize: 1000000
	},
	fileFilter: (req, file, cb) => {
		if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ //match here allows us to use regular expressions. Inside /.../. $ signifying that the extname searched for, should be at the end of the filename
			return cb(new Error('Please, upload an image.'))
		}

		cb(undefined, true)
	}
})
//upload files using multer middleware
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	
	const buffer = await sharp(req.file.buffer).resize({width: 250, heigth: 250}).png().toBuffer()
	req.user.avatar = buffer
	await req.user.save()
	res.send('Avatar uploaded.')
}, (error, req, res, next) => { //function for handling errors, placed after the router hanlder. These 4 arguements are needed.
	res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async(req, res) => {
	try{
		req.user.avatar = undefined;
		await req.user.save()
		res.send('Avatar deleted.')
	}catch(e){
		res.status(500).send()
	}
})

router.get('/users/:userId/avatar', async(req, res) => {
	try{
		const user = await User.findById(req.params.userId);

		if(!user || !user.avatar){
			throw new Error()
		}

		res.set('Content-Type','image/png')
		res.send(user.avatar)
	}catch(e){
		res.status(404).send()
	}
})

module.exports = router;