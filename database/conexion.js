const mongoose = require("mongoose");

const conexion = async() => {
	try{
		await mongoose.connect("mongodb+srv://joel8080ur:jo12el34@joel.36f4ite.mongodb.net/blog");

		console.log("Conectado a base de datos mi_blog");
		//Parametros dentro de objetos
		//useNewUrlParser: true
		//useUnifiedTopology: true
		//useCreateIndex: true
	}catch(error){
		console.log(error);
		throw new Error("No se ha conectado a base de datos");
	}
}

module.exports = {
	conexion
}