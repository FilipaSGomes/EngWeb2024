const mongoose = require('mongoose');

var periodSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    compositores: [{
        _id: String,
        nome: String
    }]
}, { versionKey: false });

module.exports = mongoose.model('periodos', periodSchema, 'periodos');
