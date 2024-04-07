const mongoose = require('mongoose');

const composerSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    dataNasc: { type: Date },
    dataObito: { type: Date },
    periodo: String
});

module.exports = mongoose.model('compositores', composerSchema, 'compositores');
