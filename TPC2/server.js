var http = require('http');
var url = require('url');
var axios = require('axios');


function createCoursePage(id) {
    return new Promise((resolve, reject) => {
        console.log('ID: ' + id);
        axios.get('http://localhost:3000/cursos/' + id)
             .then(resp => {

                let curso = resp.data;
                let p = '<p>Designação: ' + curso.designacao + '</p>';
                p += '<p>ID: ' + curso.id + '</p>';
                p += '<p>Duração: ' + curso.duracao + '</p>';
                p += '<p>Instrumento: ' + curso.instrumento['#text'] +'</p>';
                p += '<p><a href="/">Voltar página principal</a></p>';

                resolve(p);

             }).catch(erro => {
                console.log('Erro: ' + erro.toString());
                reject('Erro na obtenção do curso...');

             });
    }).catch(erro => {
        console.log('Erro: ' + erro.toString());
        reject('Erro na obtenção do curso...');
    });
}

function createStudentPage(id) {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/alunos/' + id)
             .then(async resp => {
                let aluno = resp.data;
                let p = '<p>Nome: ' + aluno.nome + '</p>';
                p += '<p>ID: ' + aluno.id + '</p>';
                p += '<p>Data de nascimento: ' + aluno.dataNasc + '</p>';
                const cursoURL = 'http://localhost:3000/cursos/' + aluno.curso;
                if (cursoURL) {
                    p += '<p>Curso: <a href="/cursos/' + aluno.curso + '">' + aluno.curso + '</a></p>';
                } else {
                    p += '<p>Curso: ' + aluno.curso + ' (Não existe)</p>';
                }
                p += '<p>Instrumento: ' + aluno.instrumento +'</p>';
                p += '<p><a href="/">Voltar página principal</a></p>';

                resolve(p);

             }).catch(erro => {
                console.log('Erro: ' + erro.toString());
                reject('Erro na obtenção do aluno...');
                });
    });
}

function createStudentsPage() {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/alunos')
             .then(resp => {
                let lista = resp.data;
                let promises = lista.map(aluno => createStudentPage(aluno.id));

                Promise.all(promises)
                    .then(value => {
                        let p = '<h2>Lista de alunos:</h2>';
                        p += '<ul>';

                        for(i in lista) {
                            p += '<li><a href="/alunos/' + lista[i].id + '">' + lista[i].id + ' - ' + lista[i].nome + '</a></li>\n';
                        }

                        p += '</ul>';
                        p += '<p><a href="/">Voltar página principal</a></p>';
                        resolve(p);

                    }).catch(erro => {
                        console.log('Erro: ' + erro.toString());
                        reject('Erro na obtenção das páginas de aluno...');
                    });
             }).catch(erro => {
                console.log('Erro: ' + erro.toString());
                reject('Erro na obtenção da lista de alunos...');

            });
    }).catch(erro => {
        console.log('Erro: ' + erro.toString());
        reject('Erro na obtenção da lista de alunos...');
    });
}

function createInstrumentsPage() {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/instrumentos')
             .then(resp => {
                let lista = resp.data;
                let p = '<h2>Lista de instrumentos:</h2>';
                p += '<ul>';

                for(i in lista) {
                    p += '<li>' + lista[i].id + ' - ' + lista[i]['#text'] + '</li>';
                }
                p += '</ul>';

                p += '<p><a href="/">Voltar página principal</a></p>';

                resolve(p);

             }).catch(erro => {
                console.log('Erro: ' + erro.toString());
                reject('Erro na obtenção da lista de instrumentos...');

            });
    }).catch(erro => {
        console.log('Erro: ' + erro.toString());
        reject('Erro na obtenção da lista de instrumentos...');
    });
}

function createCoursesPage() {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/cursos')
             .then(resp => {
                let lista = resp.data;
                let promises = lista.map(curso => createCoursePage(curso.id));

                Promise.all(promises)
                    .then(value => {
                        let p = '<h2>Lista de cursos:</h2>';
                        p += '<ul>';

                        for(i in lista) {
                            p += '<li><a href="/cursos/' + lista[i].id + '">' + lista[i].designacao + '</a></li>\n';
                        }

                        p += '</ul>';
                        p += '<p><a href="/">Voltar página principal</a></p>';

                        resolve(p);

                    }).catch(erro => {
                        console.log('Erro: ' + erro.toString());
                        reject('Erro na obtenção das páginas de curso...');
                    });
             }).catch(erro => {
                console.log('Erro: ' + erro.toString());
                reject('Erro na obtenção da lista de cursos...');

            });
    });

}

http.createServer(function (req, res) {
    console.log(req.method + ' ' + req.url);

    var q = url.parse(req.url, true);

    if(q.pathname == '/') {
        // Homepage with links to instrumentos, curso, aluno pages
        let homepageHTML = `
            <h1>Página Principal</h1>
            <ul>
                <li><a href="/instrumentos">Instrumentos</a></li>
                <li><a href="/cursos">Cursos</a></li>
                <li><a href="/alunos">Alunos</a></li>
            </ul>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
        res.write(homepageHTML);
        res.end();

    } else if (q.pathname == '/instrumentos') {
        //Lista instrumentos
        createInstrumentsPage()
            .then(p => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.write('<h1>Instrumentos</h1>');
                res.write(p);
                res.end();

            }).catch(erro => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.write(erro.toString());
                res.end();
            });
    
    } else if (q.pathname == '/alunos') {
        //Lista alunos
        createStudentsPage()
            .then(p => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.write('<h1>Alunos</h1>');
                res.write(p);
                res.end();

            }).catch(erro => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.write(erro.toString());
                res.end();
            });
    
    } else if (q.pathname == '/cursos') {
        // Lista de cursos
        createCoursesPage()
            .then(p => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.write('<h1>Cursos</h1>');
                res.write(p);
                res.end();

            }).catch(erro => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.write(erro.toString());
                res.end();
            });

    } else if (q.pathname.match(/\/alunos\/[A-Z0-9]+/)) {
        // Página de aluno
        const id = q.pathname.match(/\/alunos\/([A-Za-z0-9]+)/)[1];
        console.log('ID(alunos): ' + id);
        if (id) {
            createStudentPage(id)
                .then(p => {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                    res.write('<h1>Aluno</h1>');
                    res.write(p);
                    res.end();

                }).catch(erro => {
                    res.write(erro.toString());
                    res.end();
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Page not found...');
            }
    } else if (q.pathname.match(/\/cursos\/[A-Z0-9]+/)) {
        // Página de Curso
        const id = q.pathname.match(/\/cursos\/([A-Za-z0-9]+)/)[1];
        console.log('ID(cursos): ' + id + '.');
        if (id) {
            createCoursePage(id)
                .then(p => {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                    res.write('<h1>Curso</h1>');
                    res.write(p);
                    res.end();

                }).catch(erro => {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                    res.write(erro.toString());
                    res.end();
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Page not found...');
            }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found...');
    }

}).listen(7569);

console.log('Server running at port 7569');