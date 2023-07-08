
const fs = require("fs");
const path = require("path");

const Articulo = require("../Modelos/Articulo");

//Metodo del helper
const {validarArticulo} = require("../helpers/validar");

//Esto es o que se va enviar al cliente desde el servidor
const prueba = (req,  res) => {
	return res.status(200).json({
		mensaje:"Son una accion de prueba del controlador articculos"
	});
}

//Devuelve objetos json
const curso = (req,res) => {
	console.log("Se ha ejecutado el endPoint");

	return res.status(200).json([{
		curso:"master en react",
		autor:"Joel urbina"
	},
	{
		curso:"master en react",
		autor:"Joel urbina"
	}]);
};


const crear = (req,res) => {

	//Recoger los parametros por post a guardar
	let parametros = req.body;
	try{
				//Este metodo viene del helper de validar
		validarArticulo(parametros);

	}catch (error){
		return res.status(400).json({
			status:"error",
			mensaje:"faltan datos por enviar"
		});
	}

	//Crear el objeto a guardar

	const articulo = new Articulo(parametros);



	//Asignar valores a objeto basado en el modelo( manual o automatica)
		//articulo.titulo = parametros.titulo; - manera manual
		//Manero automatica
		//const articulo = new Articulo(parametros);


	//Guardar el articulo en la base de datos
		/*articulo.save((error,articuloGuardado)=>{
				if (error || !articuloGuardado) {
						return res.status(400).json({
						status:"error",
						mensaje:"No se ha guardado el articulo"
					});
				}
				
		});*/

	articulo.save()
	.then((data)=>{
			//Devorver el resultado correcto
		return res.status(200).json({
			mensaje:"success",
			datos:data
		});
	})
	.catch((err)=>{
		return res.status(400).json({
			mensaje:"error",
			detalles:err
		});
	});

	
}



const listar = (req,res) => {
	/*
	//Listar todos los articulos

	let consulta = Articulo.find({})
	.then((articulos) =>{
		return res.status(200).json({
			status:"success",
			articulos
		});
		
	}).catch((err)=> {
		return res.status(404).json({
				status:"error",
				mensaje:"No se han encontrado articulos",
				detalles:err
			});
	});

	*/

	

				//Listar todos los datos
			let consulta = Articulo.find({});
			
				//<---Utilizado filtros--->	

			//Limitar los resultado
				//consulta.limit(3);
				//Con parametro enviado desde la url
			if (req.params.ultimos) {
				consulta.limit(req.params.ultimos);
			}

			//desendente -> (-1) mayor hacia menor,
			// acendente->(1) menor hacia mayor
			consulta.sort({fecha: -1});

			//
			consulta.then((articulos) =>{
				return res.status(200).json({
					status:"success",

					//para tomar el parametro o valor enviado
					//desde la rutas articulos y desde la url
					//del cliente
					parametro_url:req.params.ultimos,

					cantidad:articulos.length,
					articulos
				});
				
			}).catch((err)=> {
				return res.status(404).json({
					status:"error",
					mensaje:"No se han encontrado articulos",
					detalles:err
				});
			});


	
	

} 

//Metodo para sacar un solo articulo

const uno = (req,res) => {
	//Recoger un id por la url
	let id = req.params.id;
	//Buscar el articulos
	Articulo.findById(id)
	//Si existe devuelve bien
	.then((dato)=>{
		return res.status(200).json({
			status:"success",
			id_url:id,
			//Devuelve el dato encontrado
			dato
		});
	})
	//Si no devolver un error
	.catch((err)=> {
		return res.status(404).json({
			status:"error",
			mensaje:"No se han encontrado el articulo",
			detalles:err
		});
	});
}

//Eliminar un articulo

const borrar = (req,res) => {
	let id = req.params.id;

	//Elimine con el id where id = id enviado
	Articulo.findOneAndDelete({_id:id})

	.then((art)=>{
		return res.status(200).json({
			status:"success",
			mensaje:"Articulo borrado",
			articulo:art
		});
	})
	.catch((err)=>{
		return res.status(404).json({
			status:"error",
			mensaje:"No se encuentra el articulo",
			detalles:err
		});
	});
}


//Actualizar
const editar = (req,res) => {
	let articuloId = req.params.id; //Recoger id

	//Recoger datos del body
	let parametros = req.body;
	try{
				//Este metodo viene del helper de validar
		validarArticulo(parametros);

	}catch (error){
		return res.status(400).json({
			status:"error",
			mensaje:"faltan datos por enviar"
		});
	}

	//Actualizar y buscar
		//En el tercer campo del la consulta {new:true}
		//Si es true devuelve el objeto actualizado
		//Si es false devuelve el objeto viejo
	Articulo.findOneAndUpdate({_id:articuloId},parametros,{new:true})

	.then((art)=>{
		return res.status(200).json({
			status:"success",
			mensaje:"Articulo Actualizado",
			articulo:art
		});
	})
	.catch((err)=>{
		return res.status(404).json({
			status:"error",
			mensaje:"No se encuentra el articulo",
			detalles:err
		});
	});
}

const subir  = (req,res) => {

	//Confugurar multer

	//Recoger el fichero de imajen subido

	if (!req.file && !req.files) {
		return res.status(400).json({
			status:"Error",
			mensaje:"Peticion invalida, no se ha enviado nada"
		});
	}

	//Nombre del archivo

	let nombre_archivo = req.file.originalname;

	//Extension del archivo
		//Separa el nombre del
		//archivo y la extension
	let archivo_split= nombre_archivo.split("\.");
	let extension = archivo_split[1];
	//Comprobar la extension correcta

	if (extension != "png" && extension != "jpg" &&
		extension != "jpeg" && extension != "gif" && extension != "exe") {
		//Borrar archivo y mandar respuesta
		fs.unlink(req.file.path,(err) => {
			return res.status(400).json({
				status:"Error",
				mensaje:"Imagen inválida"
			});
		});

}else{





		let articuloId = req.params.id; //Recoger id


	//Actualizar y buscar
		//En el tercer campo del la consulta {new:true}
		//Si es true devuelve el objeto actualizado
		//Si es false devuelve el objeto viejo
		Articulo.findOneAndUpdate({_id:articuloId},
			{//lO QUE se va actualizar
				imagen:req.file.filename
			},
			{new:true})

		.then((art)=>{
			return res.status(200).json({
				status:"success",
				mensaje:"Articulo Actualizado",
				articulo:art,
				fichero:req.file,
				extension
			});
		})
		.catch((err)=>{
			return res.status(404).json({
				status:"error",
				mensaje:"No se encuentra el articulo",
				detalles:err
			});
		});

	}
}

//Para enviar la respuesta una imagen
const imagen = (req, res) => {
	let fichero = req.params.fichero
	let ruta_fisica = "./imagenes/articulos/"+fichero;

	fs.stat(ruta_fisica,(err,existe) => {
		if (existe) {
			return res.sendFile(path.resolve(ruta_fisica));
		}else{
			return res.status(404).json({
				status:"Error",
				mensaje:"La imagen no existe",
				existe,
				fichero,
				ruta_fisica
			});
		}
	});
}

const buscador = (req,res) => {
	//Sacar el string de busqueda que va llegar como
	//Parametro de la url
	let busqueda = req.params.busqueda;
	//Find OR
	Articulo.find({
		"$or" : [
		//Si el titulo incluye este string de busqueda
			//Que es en {$option : i} -> i significa incluye
				/*
					como hacer un select * from articulos where titulo %busqueda% o contenido %busqueda%
				*/
				{"titulo": {
					"$regex":busqueda,
					 "$options":"i"
					}
				},//O si el contenido incluye esto
				{"contenido": {
					"$regex":busqueda,
					 "$options":"i"
					}
				},

			]
	})
	//Orden
	.sort({fecha:-1})
	//Devolver resultado
	.then((art)=>{
		if (art.length <= 0) {
			throw new Error();
		}
		return res.status(200).json({
			status:"success",
			articulos:art
		});
	})
	.catch((err)=>{
		return res.status(404).json({
			status:"error",
			mensaje:"No se han encontrado articulos"
		});
	});
	
}

//Se exporta para la rutas
module.exports = {
	prueba,
	curso,
	crear,
	listar,
	uno,
	borrar,
	editar,
	subir,
	imagen,
	buscador
}