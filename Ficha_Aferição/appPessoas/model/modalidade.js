const mongoose = require('mongoose');

const modalidadeSchema = new mongoose.Schema({
    _id: String,
    nome: String,
});

module.exports = mongoose.model('modalidades', modalidadeSchema, 'modalidades');