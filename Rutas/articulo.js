const express = require("express");

const multer = require("multer");

const router = express.Router();

const fs = require("fs");

//Viene el mensaje desde el controlador
//Y se manda al cliente cuando visita esta ruta
const ArticuloControlador = require("../Controladores/articulo");

//Si no existe la carpeta imagenes se crea
const rut = "./imagenes/articulos";

	if (!fs.existsSync(rut)) {
		fs.mkdirSync(rut,{recursive:true}) 
	}


const almacenamiento = multer.diskStorage({
	destination:(req,file,cb) => {
		//Donde esta el directorio, donde se va a subir
		cb(null,"./imagenes/articulos/");
	},
	filename:(req,file,cb) => {
		cb(null,"articulo" + Date.now() + file.originalname);
	}
});

const subidas = multer({storage: almacenamiento});



//Rutas de prueba

router.get("/ruta-prueba",ArticuloControlador.prueba);
router.get("/curso",ArticuloControlador.curso);

//Rutas post util para guardar algo en el servidor
router.post("/crear",ArticuloControlador.crear);

//router.get("/articulos/",ArticuloControlador.listar);

	//parametro obligatorio (:ultimos)
//router.get("/articulos/:ultimos",ArticuloControlador.listar);
	//Parametro opcional (:ultimos?)
router.get("/articulos/:ultimos?",ArticuloControlador.listar);

//Ruta para enviar un articulo
router.get("/articulo/:id",ArticuloControlador.uno);

//Ruta para borrar un articulo
router.delete("/articulo/:id",ArticuloControlador.borrar);

router.put("/articulo/:id",ArticuloControlador.editar);

//Subir imajen //Middleware se ejecuta antes del controlador
//[subidas.single("file")] de multer
router.post("/subir-imagen/:id",[subidas.single("file0")],ArticuloControlador.subir);

//Enviar imajen al cliente
router.get("/imagen/:fichero", ArticuloControlador.imagen);

//Busqueda
router.get("/buscar/:busqueda",ArticuloControlador.buscador);
module.exports = router;