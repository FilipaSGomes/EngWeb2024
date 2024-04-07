var express = require('express');
var router = express.Router();
var periodsController = require('../controllers/periods');
var composersController = require('../controllers/composers');

router.get('/compositores', async (req, res) => {
  try {
    const composers = await composersController.getAllComposers();
    res.json(composers);
  } catch (error) {
    console.error('Error obtaining list of composers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/compositores/:id', async (req, res) => {
  try {
    const composer = await composersController.getComposerById(req.params.id);
    if (!composer) {
      return res.status(404).json({ error: 'Composer not found' });
    }
    res.json(composer);
  } catch (error) {
    console.error('Error obtaining composer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/compositores/registo', async (req, res) => {
  try {
    const composer = await composersController.createComposer(req.body);
    res.status(201).json(composer);
  } catch (error) {
    console.error('Error creating composer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/compositores/edit/:id', async (req, res) => {
  try {
    const composer = await composersController.updateComposer(req.params.id, req.body);
    if (!composer) {
      return res.status(404).json({ error: 'Composer not found' });
    }
    res.json(composer);
  } catch (error) {
    console.error('Error updating composer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/compositores/delete/:id', async (req, res) => {
  try {
    const composer = await composersController.deleteComposer(req.params.id);
    if (!composer) {
      return res.status(404).json({ error: 'Composer not found' });
    }
    res.json(composer);
  } catch (error) {
    console.error('Error deleting composer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
router.get('/periodos', async function(req, res) { // Corrected `res` to `req`
  try{
    const p = await periodsController.getAllPeriods()
    res.json(p)

  } catch(erro){
      console.log('Error obtaining list of periodos...')
  }
});

router.get('/periodos/:id', async function(req, res) { // Corrected `res` to `req`
  try{
    const p = await periodsController.getPeriodById(req.params.id)
    res.json(p)

  } catch(erro){
      console.log('Error obtaining periodo...' + req.params.id)
  }
});

router.post('/periodos/registo', async function(req, res){ // Corrected `res` to `req`
  try{
    const period = await periodsController.createPeriod(req.body) // Added `await`
    res.json(period) // Return the created period

  } catch (erro) {
      console.log('Error creating periodo:', erro); // Log the error
      res.status(500).json({ error: 'Error creating periodo' }); // Send error response
  }
});

router.get('/periodos/delete/:id', async function(req, res){ // Corrected `res` to `req`
  try{
    const p = await periodsController.deletePeriod(req.params.id)
    res.json(p)

  } catch(erro){ 
      console.log('Error deleting periodo...')
      res.status(500).json({ error: 'Error deleting periodo' }); // Send error response
  }
});

router.get('/periodos/edit/:id', async function(req, res){ // Corrected `res` to `req`
  try{
    const p = await periodsController.getPeriodById(req.params.id)
    res.json(p)

  } catch(erro){
      console.log('Error obtaining periodo...')
      res.status(500).json({ error: 'Error obtaining periodo' }); // Send error response
  }
});

router.post('/periodos/edit/:id', async function(req, res){ // Corrected `res` to `req`
  try{
    const p = await periodsController.updatePeriod(req.params.id,req.body)
    res.json(p)

  } catch(erro){
      console.log('Error updating periodo...')
      res.status(500).json({ error: 'Error updating periodo' }); // Send error response
  }
});


module.exports = router;
