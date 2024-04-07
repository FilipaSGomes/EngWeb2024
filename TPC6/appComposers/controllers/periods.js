const Period = require('../model/period');

module.exports.getAllPeriods = async () => {
    let p = await Period.find();
    p = p.map(period => ({
        ...period.toObject(),
        id: period._id
    }));
    return p;
}

module.exports.getPeriodById = async id => {
    let p = await Period.findById(id);
    if (p) {
        p = {
            ...p.toObject(), //all the properties of the period
            id: p._id
        };
    }
    return p;
}

module.exports.createPeriod = async period => {
    let p = await Period.create(period);
    if (p) {
        p = {
            ...p.toObject(),
            id: p._id
        };
    }
    return p;
}

module.exports.updatePeriod = async (id, period) => {
    let p = await Period.findByIdAndUpdate(id, period, { new: true });
    if (p) {
        p = {
            ...p.toObject(),
            id: p._id
        };
    }
    return p;
}

module.exports.deletePeriod = async id => {
    let p = await Period.findByIdAndDelete(id);
    if (p) {
        p = {
            ...p.toObject(),
            id: p._id
        };
    }
    return p;
}
