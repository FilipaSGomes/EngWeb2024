var http = require('http')
var axios = require('axios')
const { parse } = require('querystring')

var composer = require('./composer.js')          // Necessario criar e colocar na mesma pasta
var period = require('./period.js')
var static = require('./static.js')             // Colocar na mesma pasta

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
    let ps = rep.data
    let p = []
    for (let i=0; i<ps.length;i++){
        if (!p.includes(ps[i].nome)) p.push(ps[i].nome)
    }
    return p
}

// Server creation

var compositoresServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET":
                if (req.url == "/"){
                    let homepageHTML = `
                    <link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>
                    <h1>Amazing Composers</h1>
                    <ul>
                        <li><a class=w3-text-teal href="/compositores">Composers</a></li>
                        <li><a class=w3-text-teal href="/periodos">Periods</a></li>
                    </ul>
                `;
                res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' })
                res.write(homepageHTML)
                res.end()
                }
                // GET /compositores --------------------------------------------------------------------
                else if (req.url == "/compositores") {
                    axios.get('http://localhost:3000/compositores')
                        .then(response => {
                            var compositores = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(composer.compositoresListPage(compositores, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.end('Error obtaining list of compositores...')
                        })
                }
                
                // GET /compositores/:id --------------------------------------------------------------------
                else if(/\/compositores\/C[0-9]+$/i.test(req.url)){
                    var id = req.url.split("/")[2]
                    axios.get('http://localhost:3000/compositores?id=' + id)
                        .then(response => {
                            var compositor = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(composer.compositorPage(compositor,d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.end('Error obtaining compositor...')
                        })

                }
                
                // GET /compositores/registo --------------------------------------------------------------------
                else if(req.url == "/compositores/registo"){
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(composer.compositorFormPage(d, getAllPeriodos()))
                    res.end()

                }
               
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/C[0-9]+$/i.test(req.url)){
                    var id = req.url.split("/")[3]
                    axios.get('http://localhost:3000/compositores?id=' + id)
                        .then(response => {
                            var compositor = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(composer.compositorFormEditPage(compositor,d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.end('Error obtaining compositor...')
                        })

                }
               
                // GET /compositores/delete/:id --------------------------------------------------------------------
                else if(/\/compositores\/delete\/C[0-9]+$/i.test(req.url)){
                    var id = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/compositores?id=' + id)
                        .then(response => {
                            res.writeHead(302, {'Location': '/compositores'})
                            res.end()
                        })
                        .catch(function(erro){
                            res.end('Error removing compositor...')
                        })

                }

                // GET /periodos --------------------------------------------------------------------
                else if (req.url == "/periodos") {
                    axios.get('http://localhost:3000/periodos')
                        .then(response => {
                            var periodos = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(period.periodosListPage(periodos, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.end('Error obtaining list of periodos...')
                        })
                }

                // GET /periodos/registo --------------------------------------------------------------------
                else if(req.url == "/periodos/registo"){
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(period.periodoFormPage(d))
                    res.end()

                }
                
                // GET /periodos/edit/:id --------------------------------------------------------------------
                else if(/\/periodos\/edit\/(.+)$/i.test(req.url)){
                    var id = req.url.split("/")[3]
                    axios.get('http://localhost:3000/periodos?nome=' + id)
                        .then(response => {
                            var periodo = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(period.periodoFormEditPage(periodo,d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.end('Error obtaining periodo...')
                        })

                }
               
                // GET /periodos/delete/:id --------------------------------------------------------------------
                else if(/\/periodos\/delete\/(.+)$/i.test(req.url)){
                    var id = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/periodos?nome=' + id)
                        .then(response => {
                            res.writeHead(302, {'Location': '/periodos'})
                            res.end()
                        })
                        .catch(function(erro){
                            res.end('Error removing periodo...')
                        })

                }

                // GET /periodos/:id --------------------------------------------------------------------
                else if(/\/periodos\/(.+)$/i.test(req.url)){
                    var id = req.url.split("/")[2]
                    axios.get('http://localhost:3000/periodos?nome=' + id)
                        .then(response => {
                            var periodo = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(period.periodoPage(periodo,d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.end('Error obtaining periodo...')
                        })

                }
                               
                // GET ? -> Lancar um erro
                else {
                    res.statusCode = 405
                    res.end("Error: Method not supported " + req.method)
                }
                
                break

            case "POST":
                // POST /compositores/registo --------------------------------------------------------------------
                if(req.url == "/compositores/registo"){
                    collectRequestBodyData(req, result => {
                        axios.post('http://localhost:3000/compositores', result)
                            .then(response => {
                                res.writeHead(302, {'Location': '/compositores'})
                                res.end()
                            })
                            .catch(function(erro){
                                res.end('Error (POST): registo de compositor...')
                            })
                    })
                }
                
                // POST /compositores/edit/:id --------------------------------------------------------------------
                else if (/\/compositores\/edit\/C[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result => {
                        axios.put('http://localhost:3000/compositores/' + result.id, result)
                            .then(response => {
                                res.writeHead(302, {'Location': '/compositores'})
                                res.end()
                            })
                            .catch(function(erro){
                                res.end('Error (POST): editing composer...')
                            })
                    })
                }

                // POST /periodos/registo --------------------------------------------------------------------
                else if(req.url == "/periodos/registo"){
                    collectRequestBodyData(req, result => {
                        axios.post('http://localhost:3000/periodos', result)
                            .then(response => {
                                res.writeHead(302, {'Location': '/periodos'})
                                res.end()
                            })
                            .catch(function(erro){
                                res.end('Error (POST): registo de periodo...')
                            })
                    })
                }
                
                // POST /periodos/edit/:id --------------------------------------------------------------------
                else if (/\/periodos\/edit\/(.+)$/i.test(req.url)){
                    collectRequestBodyData(req, result => {
                        // Extract composer information from the result object
                        const compositores = {};
                        for (const key in result) {
                            if (key.startsWith('C')) {
                                compositores[key] = result[key];
                            }
                        }
                        
                        // Create periodData object including nome and compositores
                        const periodData = {
                            nome: result.nome,
                            compositores: compositores
                        };
                        console.log(result);
                        console.log(periodData);

                        axios.put(`http://localhost:3000/periodos/${result.nome}`, periodData)
                            .then(response => {
                                res.writeHead(302, {'Location': '/periodos'});
                                res.end();
                            })
                            .catch(function(erro){
                                console.log(erro);
                                res.end('Error (PUT): editing periodo...');
                            });
                    });
                }
                

                // POST ? -> Lancar um erro
                else {
                    res.statusCode = 405
                    res.end("Error: Method not supported " + req.method)
                }

                break
                
            default: 
                // Outros metodos nao sao suportados
                res.statusCode = 405
                res.end("Error: Method not supported " + req.method)
                break
        }
    }
})

compositoresServer.listen(7779, ()=>{
    console.log("Server listening on 7779 port...")
})


