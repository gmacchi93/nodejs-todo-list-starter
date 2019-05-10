const express = require("express");
const tareasLogic = require("../logic/tareas");
const bodyParser = require("body-parser");

const tareasRouter = express.Router();
tareasRouter.use(bodyParser.json());

/**
 * Función aplicada por defecto a todas las respuestas.
 * Aplica el código de estado 200 a la respuesta y la cabecera
 * Content-Type igual a application/json.
 *
 * Si algún método necesita usar otro código u otas cabeceras
 * puede hacerlo en el método mismo.
 *
 * @param {object} req Petición HTTP
 * @param {object} res Respuesta HTTP
 * @param {object} next siguiente middleware a ejecutarse
 */
function allRequest(req, res, next) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  next();
}

/**
 *
 * @param {object} req Petición HTTP
 * @param {object} res  Respuesta HTTP
 * @param {object} next  siguiente middleware a ejecutarse
 */
function showOptions(req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "Accept,Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST");
  res.setHeader("Allow", "OPTIONS,GET,POST");
  res.end();
}

function showOptionsPerResource(req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "Accept,Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,DELETE,PUT");
  res.setHeader("Allow", "OPTIONS,GET,DELETE,PUT");
  res.end();
}

/**
 * Verifica que la cabecera Accept sea válida, para los endpoints que retornan JSON
 *
 * Se considera válido si es que no se envia la cabecera Accept, en cuyo caso el servicio
 * asume que retorna el contenido que soporta por defecto.
 * Y se considera válida la cabecera `application/json`, cualquiera otra cabecera produce
 * no es válida,
 *
 * Se hace una consideración especial cuando la cabecera `application/json` viene acompañada
 * de otros posibles valores como en el caso `application/json;charset=utf-8` en cuyo caso primero
 * separan los posibles valores y sólo se busca `application/json`.
 *
 * @param {string} acceptHeader Valor de la cabecera Accept de la petición
 * @returns true si es que la cabecera es válida según los criterios expuestos más arriba, y
 * false si es que no cumple los criterios.
 */
function validAcceptHeader(acceptHeader) {
  if (!acceptHeader && acceptHeader !== "") {
    return true;
  }

  if (!(acceptHeader instanceof String || typeof acceptHeader === "string")) {
    return false;
  }

  const acceptedTypes = acceptHeader.split(";").map(h => h.trim());
  if (acceptedTypes.includes("application/json")) {
    return true;
  } else {
    return false;
  }
}

/**
 * Verifica que el header Content-Type tenga el valor `application/json`, considerando que el cliente puede enviar
 * otros valores posibles como `charset=utf-8`. Este método no considera válido los valores nulos, vacíos o de
 * otro tipo que disinto a string.
 *
 * @param {string} contentTypeHeader valor de la cabecera Content-Type de la petición.
 * @returns true si es que el Content-Type es válido o false en caso contrario.
 */
function validContentTypeHeader(contentTypeHeader) {
  if (!contentTypeHeader) {
    return false;
  }

  if (
    !(
      contentTypeHeader instanceof String ||
      typeof contentTypeHeader === "string"
    )
  ) {
    return false;
  }

  const contentTypes = contentTypeHeader.split(";").map(h => h.trim());
  if (contentTypes.includes("application/json")) {
    return true;
  } else {
    return false;
  }
}

/**
 * Obtiene todas las tareas de la base de datos
 *
 * @param {object} req Petición HTTP
 * @param {object} res Respuesta HTTP
 */
async function obtenerTareas(req, res, next) {
  const acceptHeader = req.header("Accept");
  if (!validAcceptHeader(acceptHeader)) {
    res.statusCode = 400;
    res.send({
      details:
        "This endpoint only support 'application/json' media type, please verify your `Accept` header ",
      message: `Media not supported :  ${acceptHeader}`
    });
    res.end();
    return;
  }
  const tareas = await tareasLogic.getAll();
  res.send(tareas);
  res.end();
}

/**
 * Crea una tarea en la base de datos y retorna el objeto creado con un 
 * id válido.
 * 
 * @param {object} req Petición HTTP 
 * @param {object} res Respuesta HTTP
 */
async function crearTarea(req, res) {
  const contenTypeHeader = req.header("Content-Type");
  if (!validContentTypeHeader(contenTypeHeader)) {
    res.statusCode = 400;
    res.send({
      message: `Invalid Content-Type : ${contenTypeHeader}`,
      details: "This endpoint expected JSON object with attribute `description`"
    });
    res.end();
    return;
  }

  const jsonBody = req.body;

  const modeloACrear = {
    description: jsonBody.description,
    status: "PENDIENTE"
  };

  const tareaCreada = await tareasLogic.create(modeloACrear);
  res.send(tareaCreada);
  res.end();
}

/**
 * Obtiene una tarea dado su identificador idTarea
 * 
 * @param {object} req Petición HTTP.
 * @param {object} res Respuesta HTTP.
 */
async function obtenerTarea(req, res) {
  const {idTarea}  = req.params;
  try{
    const tarea = await tareasLogic.getOne(idTarea);
    res.send(tarea);
    res.end();
  }
  catch(error){
    res.statusCode = 400;
    res.send({
      message: `Can't find objecti with id : ${idTarea}`,
      details: "This endpoint expected a valid object identifier"
    });
    res.end();
  }
  
}

tareasRouter
  .route("/")
  .all(allRequest)
  .options(showOptions)
  .get(obtenerTareas)
  .post(crearTarea)
  .put((req, res, next) => {
    res.statusCode = 405;
    res.end("PUT method is not supported on /tasks");
  })
  .delete((req, res, next) => {
    res.statusCode = 405;
    res.end("DELETE method is not supported on /tasks");
  });

tareasRouter
  .route("/:idTarea")
  .all(allRequest)
  .options(showOptionsPerResource)
  .get(obtenerTarea)
  .post((req, res, next) => {
    res.statusCode = 405;
    res.end("POST operation is not suported on /tareas/" + req.params.idTarea);
  })
  .put((req, res, next) => {
    res.write("Actualizando la tarea: " + req.params.idTarea + "\n");
    res.end(
      "Actualizando la tarea: " +
        req.body.descripcion +
        " with details: " +
        req.body.estado
    );
  })
  .delete((req, res, next) => {
    res.end("Borrando la tarea : " + req.params.idTarea);
  });

module.exports = tareasRouter;

