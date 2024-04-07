const Composer = require('../model/composer');

module.exports.getAllComposers = async () => {
    let composers = await Composer.find();
    // Format the date fields and include 'periodo' field
    composers = composers.map(composer => ({
        ...composer.toObject(),
        dataNasc: composer.dataNasc ? composer.dataNasc.toISOString().split('T')[0] : null,
        dataObito: composer.dataObito ? composer.dataObito.toISOString().split('T')[0] : null,
        id: composer._id,
    }));
    return composers;
}

module.exports.getComposerById = async (id) => {
    let composer = await Composer.findOne({_id: id});
    // Format the date fields and include 'periodo' field
    if (composer) {
        composer = {
            ...composer.toObject(),
            dataNasc: composer.dataNasc ? composer.dataNasc.toISOString().split('T')[0] : null,
            dataObito: composer.dataObito ? composer.dataObito.toISOString().split('T')[0] : null,
        };
    }
    return composer;
}

module.exports.createComposer = async (composer) => {
    return await Composer.create(composer);
}

module.exports.updateComposer = async (id, composer) => {
    let updatedComposer = await Composer.findOneAndUpdate({_id: id}, composer, { new: true });
    // Format the date fields and include 'periodo' field
    if (updatedComposer) {
        updatedComposer = {
            ...updatedComposer.toObject(),
            dataNasc: updatedComposer.dataNasc ? updatedComposer.dataNasc.toISOString().split('T')[0] : null,
            dataObito: updatedComposer.dataObito ? updatedComposer.dataObito.toISOString().split('T')[0] : null,
        };
    }
    return updatedComposer;
}

module.exports.deleteComposer = async (id) => {
    let composer = await Composer.findOne({_id: id});
    if (composer) {
        await Composer.deleteOne({_id: id});
        // Format the date fields and include 'periodo' field before returning
        composer = {
            ...composer.toObject(),
            dataNasc: composer.dataNasc ? composer.dataNasc.toISOString().split('T')[0] : null,
            dataObito: composer.dataObito ? composer.dataObito.toISOString().split('T')[0] : null,
        };
    }
    return composer;
}
