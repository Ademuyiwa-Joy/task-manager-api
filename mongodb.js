// CRUD - create, read, update, delete
//insertOne, insertMany; find, findOne; updateOne, updateMany(using $set, $inc, $unset etc); deleteOne,deleteMany. 

//Note: 
//READ: 
//.findOne can take a callback
//.find does not take a callback, it takes a cursor... having a callback in it

//----------------------------------------------------------------------------------------------------
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient //to initialize connection

const { MongoClient, ObjectId } = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017' //URL to connect to the mongo server
const databaseName = 'task-manager';

const id = new ObjectId;
// console.log(id);
// console.log(id.getTimestamp())

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error, client) => {
	if(error){
		return console.log('Unable to connect to database!')
	}
	const db = client.db(databaseName);
	// db.collection('users').insertOne({
	// 	_id: id,
	// 	name: 'Jamel',
	// 	age: 24
	// }, (error, result) => {
	// 	if (error){
	// 		return console.log('Could not insert user')
	// 	}
	// 	console.log(result)
	// })
	// db.collection('users').insertMany([{name: "Aladey",age: 19}, 
	// {name:'Daniel', age: 25}
	// ],(error, result) => {
	// 	if(error){
	// 		return console.log('Unable to insert documents!')
	// 	}
	// 	console.log(result.insertedCount)
	// })

	// db.collection('tasks').insertMany([{description: 'Read', completed: true},
	// {description: 'Update', completed: false},
	// {_id: id, description: 'delete', completed: false}], (error, result) => {
	// 	if(error){
	// 		return console.log('Unable to insert tasks')
	// 	}
	// 	console.log(result.insertedIds)
	// })

	// db.collection('tasks').findOne({_id: new ObjectId("62d54b1552b5db47e60771c6")}, (error, task) => {
	// 	if(error){
	// 		return console.log('Unabel to getch task')
	// 	}
	// 	console.log(task)
	// })
	// db.collection('tasks').find({completed: true}).count((error, count) => {
	// 	if(error){
	// 		return console.log('Unable to fetch count')
	// 	}
	// 	console.log(count)
	// })

	// db.collection('tasks').updateOne({
	// 	_id: new ObjectId('62d54b1652b5db47e60771c8')
	// }, {
	// 	$set: {
	// 		description: "Watawi"
	// 	}
	// }).then((result) => {
	// 	console.log("Success")
	// }).catch((error) => {
	// 	console.log("error")
	// });

	// db.collection('tasks').updateMany({
	// 	completed: true
	// }, {
	// 	$set: {
	// 		completed: false
	// 	}
	// }).then((result) => {
	// 	console.log(result.modifiedCount)
	// }).catch((error) => {
	// 	console.log("Something went wrong")
	// })

	// db.collection('tasks').deleteOne({
	// 	description: 'Watawi'
	// }).then((result) => {
	// 	console.log('Deleted Successfully')
	// }).catch((error) => {
	// 	console.log('Error')
	// })

	// db.collection('tasks').deleteMany({
	// 	completed: false
	// }).then((result) => {
	// 	console.log('deleted Succesfully!', result.deletedCount)
	// }).catch((error) => {
	// 	console.log(error)
	// })
})