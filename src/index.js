const express = require('express');
const mongoose = require('./db/mongoose.js')
const User = require('./models/user.js')
const Task = require('./models/task.js');

const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task.js');

const app = express();
const port = process.env.PORT;

app.use(express.json())
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log('Server up on port '+ port)
})



//Notes-----------------
// const bcrypt = require('bcryptjs');

// const myFunction = async () => {
// 	const password = 'Red12345';
// 	const hashedPassword = await bcrypt.hash(password, 8) //8 rounds* the most suitable 

// 	console.log(password);
// 	console.log(hashedPassword);

// 	const isMatch = await bcrypt.compare('red12345', hashedPassword);
// 	console.log(isMatch)
// }

//myFunction()

//jsonwebtoken; .sign takes 2 or 3 arguements: A unique identifier, the secret key and maybe an expiration time
// const jwt = require('jsonwebtoken');
//  const myFunction = async () => {
// 	const token = jwt.sign({_id: '12bbbd'}, 'ThisIsmysecretKey', {expiresIn : '1 week'})
// 	console.log(token)

// 	const data = jwt.verify(token, 'ThisIsmysecretKey');
// 	console.log(data)
// }

//myFunction()

//Relationship between user and task
// const main = async () => {
// 	// const task = await Task.findById('62e05669675aaf41465d2728');
// 	// await task.populate('owner')
// 	// console.log(task.owner)	

// 	const user = await User.findById('62e0562f675aaf41465d2723')
// 	await user.populate('myTasks')
// 	console.log(user.myTasks)
// }

// main();

