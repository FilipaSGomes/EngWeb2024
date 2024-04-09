var express = require('express');
var router = express.Router();
var pessoasController = require('../controller/person');
var modalidadesController = require('../controller/modalidade');

//-------------------------- Pessoas --------------------------

router.get('/pessoas', async (req, res) => {
  try {
    const pessoas = await pessoasController.getAllPeople();
    res.json(pessoas);
  } catch (error) {
    console.error('Error obtaining list of people:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/pessoas/:id', async (req, res) => {
  try {
    const pessoa = await pessoasController.getPersonById(req.params.id);
    if (!pessoa) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json(pessoa);
  } catch (error) {
    console.error('Error obtaining Person:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/pessoas', async (req, res) => {
  try {
    const personData = req.body;
    let newPersonData = {
      _id: personData._id,
      nome: personData.nome,
      idade: personData.idade,
      sexo : personData.sexo,
      morada: {
          cidade: personData.cidade,
          distrito: personData.distrito,
      },
      descrição: personData.descrição,
      profissão: personData.profissão,
      partido_politico: {
          party_abbr: personData.party_abbr,
          party_name: personData.party_name
      },
      religiao: personData.religiao,
      desportos: [personData.desportos],
      animais: [personData.animais],
      figura_publica_pt: personData.figura_publica_pt,
      marca_carro: personData.marca_carro,
      destinos_favoritos: [personData.destinos_favoritos],
      atributos: {
          fumador: personData.fumador,
          gosta_cinema: personData.gosta_cinema,
          gosta_viajar: personData.gosta_viajar,
          acorda_cedo: personData.acorda_cedo,
          gosta_ler: personData.gosta_ler,
          gosta_musica: personData.gosta_musica,
          gosta_comer: personData.gosta_comer,
          gosta_animais_estimacao: personData.gosta_animais_estimacao,
          gosta_dancar: personData.gosta_dancar,
          comida_favorita: personData.comida_favorita
        }
    };

    const person = await pessoasController.createPerson(newPersonData);
        
    res.status(201).json(person);
  } catch (error) {
    console.error('Error creating Person:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/pessoas/:id', async (req, res) => {
  try {
    const person = await pessoasController.updatePerson(req.params.id, req.body);
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json(person);
  } catch (error) {
    console.error('Error updating Person:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/pessoas/:id', async (req, res) => {
  try {
    const person = await pessoasController.deletePerson(req.params.id);
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json(person);
  } catch (error) {
    console.error('Error deleting Person:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//-------------------------- Modalidades --------------------------

router.get('/modalidades', async (req, res) => {
  try {
    const modalidades = await modalidadesController.getAllModalidades();
    res.json(modalidades);
  } catch (error) {
    console.error('Error obtaining list of modalidades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get(/^modalidades\/([a-zA-Z\s]+)$/, async (req, res) => {
  try {
    const m = req.params[0];
    let newString = '';
    for (let i = 0; i < m.length; i++) {
        // Add a space before each uppercase letter (except the first one)
        if (m[i] === m[i].toUpperCase() && i > 0) {
            newString += ' ' + m[i];
        } else {
            newString += m[i];
        }
    }

    const modalidades = await modalidadesController.getModalidadesByName(newString);
    res.json(modalidades);
  } catch (error) {
    console.error('Error obtaining list of modalidades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;
