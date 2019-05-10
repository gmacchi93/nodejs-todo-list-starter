const Tarea = require("../models/tarea");
const mongoose = require("mongoose");

/**
 * Crea un documento Tarea en la Base de datos.
 *
 * @param {object} tareaModel Objeto que se pretende crear.
 * @returns {Promise<Tarea>} Promise de Tarea creada.
 */
async function create(tareaModel) {
  const tarea = new Tarea(tareaModel);
  const tareaCreada = await tarea.save();
  console.info(`Tarea ${tareaCreada["_id"]} creada exitosamente.`);
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
  let tareas = await Tarea.find();
  console.info(`Se obtuvieron ${tareas.length} tareas.`);
  return tareas;
}

async function getOne(id) {
  console.debug(`Obteniendo tarea con id ${id}`);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid object Id ");
  }
  try {
    const tarea = await Tarea.findById(`${id}`);
    console.info(`Se obtuvo la tarea con id ${tarea["_id"]}`);
    return tarea;
  } catch (error) {
    console.error(
      `No se pudo obtener la tarea con id ${id}, detalles ${error}`
    );
    throw error;
  }
}

async function update(id, newValues) {
  try {
    const updatedModel = await Tarea.updateOne({ _id: id }, newValues);
    return updatedModel;
  } catch (error) {
    console.error(`Error al intentar actualizar ${error.name} : ${error.name}`);
    throw new Error(`Error trying to update ${id}`);
  }
}

module.exports = {
  create,
  erase,
  getAll,
  getOne,
  update
};
