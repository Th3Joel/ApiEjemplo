const {conexion} = require("./database/conexion");
const express = require("express");
const handler = require("serve-handler");
const cors = require("cors");
const readline = require("readline");

//Inizializar app 
console.log("Joel urbina - API");

	//Elegir el puerto
	let puerto =process.env.PORT ?? 8080;;

		  //Conectar a la base de datos

		//conexion();


		//Crear servidor node

		const app = express();

		//Configurar cors para solucionar problemas con las
		//peticiones

		app.use(cors());

		//Lconvertir body a objeto js
		app.use(express.json()); //Recibir datos en formato json

		//Recibiendo por form-urlencoded
		//
		app.use(express.urlencoded({extended:true}));

		//Crear rutas

		const rutas_articulos = require("./rutas/articulo");

		//Cargo las rutas

		app.use("/api",rutas_articulos);

		//Rutas pruebas declaradas aqui
				//Devuelve objetos json
				app.get("/probando", (req,res) => {
					console.log("Se ha ejecutado el endPoint");

					return res.status(200).json([{
						curso:"master en react",
						autor:"Joel urbina"
					},
					{
						curso:"master en react",
						autor:"Joel urbina"
					}]);
				});

		app.use("/",(req,res)=>{
		  return handler(req, res,{
		    public:"./public"
		  });
		})
		//Crear servidor y eschuchar peticiones http


		app.listen(puerto,() => {
			console.log("Servidor corriendo en el puerto "+puerto);
		});


