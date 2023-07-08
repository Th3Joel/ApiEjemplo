const validator = require("validator");

const validarArticulo = (parametros) => {
	//validar datos
		

			//Si esta vacio y la longitud de caracteres e 
			//Menor a 5 o mayor a 15 va mandar error

			let validar_titulo = !validator.isEmpty(parametros.titulo) &&
			validator.isLength(parametros.titulo,{min:5, max:undefined});

			//Si esta vacio
			let validar_contenido = !validator.isEmpty(parametros.contenido);

			//Si esta vacio manda el error
			if (!validar_titulo || !validar_contenido) {
				throw new Error("No se ha validado la informacion");
			}
		
}

module.exports = {
	validarArticulo
}