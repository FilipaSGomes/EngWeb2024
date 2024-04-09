const Person = require('../model/person');

module.exports.getAllPeople = async () => {
    return await Person.find();
}

module.exports.getPersonById = async (id) => {
    return await Person.findById(id);
}

module.exports.createPerson = async (personData) => {
    try {
        // Create a new Person document using the provided personData
        const person = await Person.create(personData);
        return person; // Return the created person document
    } catch (error) {
        console.error('Error creating Person:', error);
        throw error; // Rethrow the error for handling in the route or other middleware
    }
};

module.exports.updatePerson = async (id, updatedPersonData) => {
    let updatedPerson = await Person.findOneAndUpdate(
        { _id: id }, 
        updatedPersonData, // Provide the updated data here
        { new: true }
    );
    return updatedPerson;
}

module.exports.deletePerson = async (id) => {
    let person = await Person.findOne({_id:id});
    if (person) {
        await Person.deleteOne({_id: id});
    }
    return person;
}
