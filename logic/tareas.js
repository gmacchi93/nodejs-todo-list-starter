
/**
 * Crea un documento Tarea en la Base de datos.
 *
 * @param {object} tareaModel Objeto que se pretende crear.
 * @returns {Promise<Tarea>} Promise de Tarea creada.
 */
async function create(tareaModel) {
  // Esta tarea debe ser creada en la base de datos
  const tareaCreada = await Promise.resolve(tareaModel);
  console.info(`Tarea ${tareaCreada['_id']} creada exitosamente.`);
  return tareaCreada;
}

async function erase(id) {
  return await Promise.resolve({});
}

async function getAll() { 
  // Estos datos en duro serán reemplazados por llamadas de la base de datos
  const tareas_dummy = [
    {
      "date": "Tue, 16 Apr 2019 14:45:30 GMT",
      "description": "asdad",
      "id": 539,
      "status": "TERMINADO"
    },
    {
      "date": "Tue, 16 Apr 2019 03:34:20 GMT",
      "description": "perro",
      "id": 510,
      "status": "TERMINADO"
    }
  ];
  const tareas = await Promise.resolve(tareas_dummy);
  console.info(`Se obtuvieron ${tareas.length} tareas.`);
  return tareas;
}

 function getOne(id) {
  console.debug(`Obtenienod tarea con id ${id}`);
  return {};
}


async function update(id,newValues){
    return Promise.resolve({});
}

module.exports = {
  create,
  erase,
  getAll,
  getOne,
  update
};
