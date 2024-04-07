var express = require('express')
var router = express.Router()
var axios = require('axios')


// Aux functions
function collectRequestBodyData(request, callback) {
  if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
      let body = ''
      request.on('data', chunk => {
          body += chunk.toString()
      })
      request.on('end', () => {
          callback(parse(body))
      })
  }
  else {
      callback(null)
  }
}

function getAllPeriodos(){
  const rep = axios.get('http://localhost:3000/periodos');
  let p = []
  return rep.then(response => {
      let ps = response.data
      for (let i = 0; i < ps.length; i++) {
          if (!p.some(item => item.id === ps[i].id)) {
              p.push({ id: ps[i].id, nome: ps[i].nome })
          }
      }
      return p
  }).catch(function(erro){
      console.log('Error obtaining list of periodos...')
  })
}

function getAllComposers(){
  const c = axios.get('http://localhost:3000/compositores');
  let compositores = []
  return c.then(response => {
      let cs = response.data
      for (let i = 0; i < cs.length; i++) {
          if (!compositores.some(item => item.id === cs[i].id)) {
              compositores.push({ id: cs[i].id, nome: cs[i].nome })
          }
      }
      return compositores
  }).catch(function(erro){
      console.log('Error obtaining list of compositores...')
  })
}


/* GET home page. */
router.get('/', function(req, res) {
  var d = new Date().toISOString().substring(0,16)
  res.render('index', { title: 'Great Musicians', data: d });
});

router.get('/compositores', function(req, res) {
  const p = getAllPeriodos()
  axios.get('http://localhost:3000/compositores')
    .then( resposta => {
      var d = new Date().toISOString().substring(0,16)
      p.then(ap => {
        console.log(resposta.data)
        res.render('listComposers', {lista: resposta.data, data: d, titulo: "Composers List", all_periods: ap});
      }).catch(function(erro){
        console.log('Error obtaining list of periodos...')
      }).catch( erro => {
      res.render('error', {error: erro, message: "Erro ao recuperar os composers."})
    })
  })
});

router.get('/periodos', function(req, res) {
  const c = getAllComposers()
  axios.get('http://localhost:3000/periodos')
    .then( resposta => {
      var d = new Date().toISOString().substring(0,16)
      c.then(ac => {
        res.render('listPeriods', {lista: resposta.data, data: d, titulo: "Periods List", all_composers: ac});
      }).catch(function(erro){
        console.log('Error obtaining list of compositores...')
      }).catch( erro => {
        res.render('error', {error: erro, message: "Erro ao recuperar os periodos."})
    }).catch( erro => {
      res.render('error', {error: erro, message: "Erro ao recuperar os periodos."})
    })
  })
});


router.get('/compositores/registo', function(req, res) {
  const p = getAllPeriodos()
  var d = new Date().toISOString().substring(0,16)
  p.then(ap => {
    res.render('registerComposer', {data: d, titulo: "Composer Registration", all_periods: ap});
  }).catch(function(erro){
    console.log('Error obtaining list of periodos...')
  })
});

router.get('/periodos/registo', function(req, res) {
  const c = getAllComposers()
  var d = new Date().toISOString().substring(0,16)
  c.then(ac => {
    res.render('registerPeriod', {data: d, titulo: "Period Registration", all_composers: ac});
  }).catch(function(erro){
    console.log('Error obtaining list of compositores...')
  })
});


router.get('/compositores/:id', function(req, res) {
  const p = getAllPeriodos()
  var d = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:3000/compositores/' + req.params.id)
    .then( resposta => {
      var d = new Date().toISOString().substring(0,16)
      p.then(ap => {
        res.render('composer', {composer: resposta.data, data: d, titulo: "Consult composer", all_periods: ap});
      }).catch(function(erro){
        console.log('Error obtaining list of periodos...')
      })
    }).catch( erro => {
      res.render('error', {error: erro, message: "Erro ao recuperar o composer."})
    })
});

router.get('/periodos/:id', function(req, res) {
  const c = getAllComposers()
  var d = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:3000/periodos/' + req.params.id)
    .then( resposta => {
      var d = new Date().toISOString().substring(0,16)
      c.then(ac => {
        res.render('period', {period: resposta.data, data: d, titulo: "Consult period", all_composers: ac});
      }).catch(function(erro){
        console.log('Error obtaining list of compositores...')
      })
    }).catch( erro => {
      res.render('error', {error: erro, message: "Erro ao recuperar o periodo."})
    })      
});

router.post('/compositores/registo', function(req, res){
    const new_id = "C" + req.body.id
    const comp = {
        id : new_id,
        nome: req.body.nome,
        dataNasc: req.body.dataNasc,
        dataObito: req.body.dataObito,
        periodo: req.body.periodo
    }
    var d = new Date().toISOString().substring(0,16)
    console.log(JSON.stringify(req.body))
    axios.post('http://localhost:3000/compositores', comp)
      .then( resposta => {
        res.render('registerConfirmation', {info: comp, data: d, titulo: "Composer Registration Confirmation"})
      })
      .catch( erro => {
        res.render('error', {error: erro, message: "Erro ao gravar um composer novo."})
      })
})

router.post('/periodos/registo', function(req, res){
    const new_id = "P" + req.body.id
    const cps = [];
    for (const key in req.body) {
        if (key.startsWith('C')) {
            cps.push({key : req.body[key]});
        }
    }
    // Create periodData object including nome and compositores
    const periodData = {
        id: new_id,
        nome: req.body.nome,
        compositores: cps
    };
    var d = new Date().toISOString().substring(0,16)
    console.log(JSON.stringify(req.body))
    axios.post('http://localhost:3000/periodos', periodData)
      .then( resposta => {
        res.render('registerConfirmation', {info: periodData, data: d, titulo: "Period Registration Confirmation"})
      })
      .catch( erro => {
        res.render('error', {error: erro, message: "Erro ao gravar um periodo novo."})
      })
});

router.get('/compositores/delete/:id', function(req, res){
  axios.delete('http://localhost:3000/compositores/' + req.params.id)
    .then( resposta => {
      var d = new Date().toISOString().substring(0,16)
      res.render('deleteConfirmation', {data: d, titulo: "Period Delete Confirmation"})
    })
    .catch( erro => {
      res.render('error', {error: erro, message: "Erro ao apagar o composer."})
    })
});

router.get('/periodos/delete/:id', function(req, res){
  axios.delete('http://localhost:3000/periodos/' + req.params.id)
    .then( resposta => {
      var d = new Date().toISOString().substring(0,16)
      res.render('deleteConfirmation', {data: d, titulo: "Composer Delete Confirmation"})
    })
    .catch( erro => {
      res.render('error', {error: erro, message: "Erro ao apagar o periodo."})
    })
});

router.get('/compositores/edit/:id', function(req, res){
  const p = getAllPeriodos()
  axios.get('http://localhost:3000/compositores/' + req.params.id)
    .then( resposta => {
      var d = new Date().toISOString().substring(0,16)
      p.then(ap => {
        res.render('editComposer', {composer: resposta.data, data: d, titulo: "Edit composer", all_periods: ap});
      }).catch(function(erro){
        console.log('Error obtaining list of periodos...')
      })
    }).catch( erro => {
      res.render('error', {error: erro, message: "Erro ao recuperar o composer."})
    })
});

router.get('/periodos/edit/:id', function(req, res){
  const c = getAllComposers()
  axios.get('http://localhost:3000/periodos/' + req.params.id)
    .then( resposta => {
      var d = new Date().toISOString().substring(0,16)
      c.then(ac => {
        res.render('editPeriod', {period: resposta.data, data: d, titulo: "Edit period", all_composers: ac});
      }).catch(function(erro){
        console.log('Error obtaining list of compositores...')
      })
    }).catch( erro => {
      res.render('error', {error: erro, message: "Erro ao recuperar o periodo."})
    })
});


router.post('/compositores/edit/:id', function(req, res){
    axios.put('http://localhost:3000/compositores/' + req.params.id, req.body)
      .then( resposta => {
        var d = new Date().toISOString().substring(0,16)
        res.render('editConfirmation', {info: req.body, data: d, titulo: "Composer Edit Confirmation"})
      })
      .catch( erro => {
        res.render('error', {error: erro, message: "Erro ao atualizar o composer."})
      })
});

router.post('/periodos/edit/:id', function(req, res){
    // Extract composer information from the req.body object
    const compositores = {};
    for (const key in req.body) {
        if (key.startsWith('C')) {
            compositores[key] = req.body[key];
        }
    }
    
    // Create periodData object including nome and compositores
    const periodData = {
        nome: req.body.nome,
        compositores: compositores
    };
    axios.put('http://localhost:3000/periodos/' + req.params.id, periodData)
      .then( resposta => {
        var d = new Date().toISOString().substring(0,16)
        res.render('editConfirmation', {info: req.body, data: d, titulo: "Period Edit Confirmation"})
      })
      .catch( erro => {
        res.render('error', {error: erro, message: "Erro ao atualizar o periodo."})
      })
});


module.exports = router;
