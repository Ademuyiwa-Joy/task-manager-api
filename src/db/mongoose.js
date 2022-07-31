//Note:
//save() returns a promise.

//-------->
// const me = new User({
// 	name: '    Joy',
// 	email: 'Joyoluwatobi36@gmail.com ',
// 	age: 20,
// 	password: '3456hththt' 
// })

// me.save().then(() => {
// 	console.log(me)
// }).catch((error) => {
// 	console.log('Error:', error._message)
// })

//-------->
// const task = new Task({
// 	description: 'ball',
// 	completed: true
// })

// task.save().then(() => {
// 	console.log(task)
// }).catch((error) => {
// 	console.log('Error:', error._message)
// })
//-----------------------------------------------------------------------------

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {  //with database name
	useNewUrlParser: true
});



