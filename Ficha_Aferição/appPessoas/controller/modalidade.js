const Modalidade = require('../model/modalidade');

// Get all modalidades without repetition
module.exports.getAllModalidades = async () => {
    return await Modalidade.find();
}

// Get modalidades by name
module.exports.getModalidadesByName = async (name) => {
    console.log(name);
    return await Modalidade.find({ nome: name });
}
