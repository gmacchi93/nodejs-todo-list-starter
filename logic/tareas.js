const Tarea = require("../models/tarea");

/**
 * Crea un documento Tarea en la Base de datos.
 *
 * @param {object} tareaModel Objeto que se pretende crear.
 * @returns {Promise<Tarea>} Promise de Tarea creada.
 */
async function create(tareaModel) {
  const tarea = new Tarea(tareaModel);
  const tareaCreada = await tarea.save();
  console.info(`Tarea ${tareaCreada['_id']} creada exitosamente.`);
  return tareaCreada;
}

async function erase(id) {
  try {
    await Tarea.remove(id);
  } catch (error) {
    console.error(`Error al intentar borrar ${error.name} : ${error.name}`);
  }

  return;
}

async function getAll() {
  const tareas = await Tarea.find();
  console.info(`Se obtuvieron ${tareas.length} tareas.`);
  return tareas;
}

async function getOne(id) {
  console.debug(`Obtenienod tarea con id ${id}`);
  const tarea = await Tarea.findById(`${id}`);
  console.info(`Se obtuvo la tarea con id ${tarea['_id']}`);
  return tarea;
}


async function update(id,newValues){
    try{
        const updatedModel = await Tarea.updateOne({_id:id},newValues);
        return updatedModel;
    }catch(error){
        console.error(`Error al intentar actualizar ${error.name} : ${error.name}`);
    }
    return null;
}

module.exports = {
  create,
  erase,
  getAll,
  getOne,
  update
};
