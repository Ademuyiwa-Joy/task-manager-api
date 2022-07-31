const express = require('express');
const router = new express.Router();
const Task = require('../models/task.js')
const auth = require('../middleware/auth');
const User = require('../models/user');

//GET /tasks?completed=true
//GET /tasks?limit=2&skip=2
//GET /tasks?sortBy=createdAt:desc

router.get('/tasks', auth, async (req, res) => {
	// Task.find({}).then((tasks) => {
	// 	res.send(tasks)
	// }).catch((e) => {
	// 	res.status(500).send() //internal server error
	// })
		const match = {}
		const sort = {}
		if(req.query.completed){
			match.completed = req.query.completed === 'true'
		}

		if(req.query.sortBy){
			const parts = req.query.sortBy.split(':')
			sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 //ternary operator
		}
	try {
		// const tasks = await Task.find({owner: req.user._id})
		// res.send(tasks)
		
		await req.user.populate({
			path: 'myTasks',
			match,
			options: {
				limit: parseInt(req.query.limit),
				skip: parseInt(req.query.skip),
				sort
			}
		})
		res.send(req.user.myTasks)
	}catch(e) {
		res.status(500).send()
	}
	
});


router.get('/tasks/:taskId', auth, async (req, res) => {
	const _id = req.params.taskId;
	// Task.findById(_id).then((task) => {
	// 	if(!task){
	// 		return res.status(404).send('Task not found!')
	// 	}
	// 	res.send(task)
	// }).catch((e) => {
	// 	res.status(500).send()
	// })

	try {
		const task = await Task.findOne({_id, owner: req.user._id});
		if(!task){
			return res.status(404).send('Task not found!')
		}
		res.send(task)
	}catch (e) {
		res.status(500).send()
	}
})


router.post('/tasks', auth, async (req, res) => {
	// const task = new Task(req.body);

	// task.save().then(() => {
	// 	res.status(201).send(task)
	// }).catch((e) => {
	// 	res.status(400).send(e)
	// })

	const task = new Task({
		...req.body, 
		owner: req.user._id
	})

	try {
		await task.save();
		res.status(201).send(task)
	} catch(e){
		res.status(400).send(e)
	}
});


router.patch('/tasks/:taskId', auth, async (req, res) => {
	//for invalid req.body inputs (properties)
	const updates = Object.keys(req.body); //converting req.body from an object to an array of properties
	const allowedUpdates = ['description','completed'];
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update) //returns true or false, checking... 
	)																	//...if each individual update is present in allowedUpdates, returning a collective T or F.
	
	
	if(!isValidOperation){
		return res.status(400).send({error: "Invalid update"})
	}
	
	try {
		//const task = await Task.findById(req.params.taskId)
		
		const task = await Task.findOne({_id: req.params.taskId, owner: req.user._id})

		if(!task){
			return res.status(404).send('Task not found!')
		}

		updates.forEach((update) => {
			return task[update] = req.body[update]
		})

		await task.save()
	
		res.send(task)
	}catch (e) {
		res.status(400).send()
	}
})

router.delete('/tasks/:taskId', auth, async (req, res) => {
	try {
		const task = await Task.findOneAndDelete({_id: req.params.taskId, owner: req.user._id});
		if(!task){
			return res.status(404).send('Task not found!')
		}
		
		res.send({status:'Deleted successfully', task})
	}catch (e) {
		res.status(500).send()
	}
})


module.exports = router;