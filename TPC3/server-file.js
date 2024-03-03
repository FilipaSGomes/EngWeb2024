var http = require('http')
var fs = require('fs')
var url = require('url')
var axios = require('axios')

function create_ator_list(){
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/movies')   
            .then(function (resp) {
                let actors = []
                for (let m of resp.data) {
                    for (let a of m.cast) {
                        if (!actors.includes(a)) {
                            actors.push(a)
                        }
                    }
                }
                let p = "<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>"
                p += "<h1>American Movies</h1><h2>Actor List :</h2><ul>"
                for (let a of actors) {
                    p += "<li><a class=w3-text-teal href='/ator/" + a + "'>" + a + "</a></li>"
                }
                p += '</ul>'
                p += '<p><a class=w3-text-teal href="/">Back to Menu</a></p>'
                resolve(p)
            }).catch(error => {
                console.log('Error: ' + error.toString())
                reject('Error obtaining actor list...')
            })
    })

}

function create_ator(ator_name){
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/movies')
            .then(function (resp) {
                let p = "<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>"
                p += "<h1>American Movies</h1><h2>Actor: " + ator_name + "</h2><ul>"
                for (let m of resp.data) {
                    if (m.cast.includes(ator_name)) {
                        p += "<li><a class=w3-text-teal href='/filmes/" + m["_id"]["$oid"] + "'>" + m["title"] + "</a></li>"
                    }
                }
                p += '</ul>'
                p += '<p><a class=w3-text-teal href="/">Back to Menu</a></p>'
                resolve(p)
            }).catch(error => {
                console.log('Error: ' + error.toString())
                reject('Error obtaining actor movies...')
            })      
    }).catch(error => {
        console.log('Error: ' + error.toString())
        reject('Error on actor creation...')
    })
}

function create_genre_movies(genre_name){
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/movies')
            .then(function (resp) {
                let p = "<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>"
                p += "<h1>American Movies</h1><h2>Genre: " + genre_name + "</h2><ul>"
                for (let m of resp.data) {
                    if (m.genres) {
                        if (m.genres.includes(genre_name)) {
                            p += "<li><a class=w3-text-teal href='/filmes/" + m["_id"]["$oid"] + "'>" + m["title"] + "</a></li>"
                        }
                    }
                }
                p += '</ul>'
                p += '<p><a class=w3-text-teal href="/">Back to Menu</a></p>'
                resolve(p)
            }).catch(error => {
                console.log('Error: ' + error.toString())
                reject('Error obtaining genre movies...')
            })
        }).catch(error => {
            console.log('Error: ' + error.toString())
            reject('Error on genre movies creation...')
        }
    )
}

function create_genre_list(){
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/movies')   
            .then(function (resp) {
                let p = "<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>"
                p += "<h1>American Movies</h1><h2>Genre List :</h2><ul>"
                let genres = []
                for (let m of resp.data) {
                    if (m.genres) {
                        for (let g of m.genres) {
                            if (!genres.includes(g)) {
                                genres.push(g)
                                p += "<li><a class=w3-text-teal href='/genero/" + g + "'>" + g + "</a></li>"
                            }
                        }
                    }
                }
                p += '</ul>'
                p += '<p><a class=w3-text-teal href="/">Back to Menu</a></p>'
                resolve(p)

            }).catch(error => {
                console.log('Error: ' + error.toString())
                reject('Error obtaining genre list...')

            })
    })
}

function create_movie_list(){
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/movies')   
            .then(function (resp){
                let l_movies = resp.data
                let p = "<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>"
                p += "<h1>American Movies</h1><h2>Movie List :</h2><ul>"

                for (let movie of l_movies){
                    p += "<li><a class=w3-text-teal href='/filmes/" + movie["_id"]["$oid"] + "'>" + movie["title"] + "</a></li>"
                }

                p += '</ul>'
                p += '<p><a class=w3-text-teal href="/">Back to Menu</a></p>'
                resolve(p)

            }).catch(error => {
                console.log('Error: ' + error.toString())
                reject('Error obtaining movie list...')
            }
        )
    })
}


function create_movie(movie_id){
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/movies?_id.$oid=' + movie_id)
            .then(function (resp) {
                let movie = resp.data[0]
                let p = "<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>"
                p += "<h1>American Movies</h1>"
                p += "<h2>" + movie["title"] + "</h2><ul>"
                p += "<p>Year: " + movie["year"]
                p += "<p></p>Cast:<p><ul>" 
                if (movie["cast"].length == 0){
                    p += "<li>None</li>"
                } else {
                    for (let c of movie["cast"]){
                        p += '<li><a class=w3-text-teal href="/ator/' + c + '">' + c + '</a></li>'
                    }
                }

                p += "</ul>"
                p += "<p>Genre:</p><ul>"
                if (movie["genres"].length == 0){
                    p += "<li>None</li>"
                } else {
                    for (let g of movie["genres"]){
                        p += '<li><a class=w3-text-teal href="/genero/' + g + '">' + g + '</a></li>'
                    }
                }

                p += "</ul>"
                p += '<p><a class=w3-text-teal href="/">Back to Menu</a></p>'
                resolve(p)
            }).catch(function (error) {
                console.error('Error fetching movie:', error)
                reject('Internal Server Error...')
            }
        )
    })
}

http.createServer(function (req, res){
    var q = url.parse(req.url, true)
    console.log(req.method + ' ' + req.url)
    if (q.pathname == '/filmes') {
        create_movie_list()
            .then(p => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write(p)
                res.end()

            }).catch(erro => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write(erro.toString())
                res.end()
            }) 

    } else if (q.pathname == '/') {
        let homepageHTML = `
            <link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>
            <h1>American Movies</h1>
            <ul>
                <li><a class=w3-text-teal href="/filmes">Movie List</a></li>
                <li><a class=w3-text-teal href="/generos">Genre List</a></li>
                <li><a class=w3-text-teal href="/ator">Actor List</a></li>
            </ul>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' })
        res.write(homepageHTML)
        res.end()

    } else if (q.pathname == '/w3.css') {
        fs.readFile('w3.css', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/csscharset=utf-8'})
            res.write(data)
            res.end()
        })

    } else if (q.pathname == '/generos') {
        create_genre_list()
            .then(p => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write(p)
                res.end()

            }).catch(erro => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write(erro.toString())
                res.end()
            })
    
    } else if (q.pathname == '/ator') {
        create_ator_list()
            .then(p => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write(p)
                res.end()

            }).catch(erro => {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write(erro.toString())
                res.end()
            })

    } else if (q.pathname.match(/\/ator\/[A-Za-z]+/)) {
        const id = q.pathname.match(/\/ator\/([A-Za-z]+)/)[1]
        if (id) {
            create_ator(id)
                .then(p => {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(p)
                    res.end()

                }).catch(erro => {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(erro.toString())
                    res.end()
                })

        } else {
            res.write("Error 404: Page not found!")
            res.end()
        }
    
    } else if (q.pathname.match(/\/filmes\/[A-Za-z0-9]+/)) {
        const id = q.pathname.match(/\/filmes\/([A-Za-z0-9]+)/)[1]
        if (id) {
            create_movie(id)
                .then(p => {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(p)
                    res.end()

                }).catch(erro => {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(erro.toString())
                    res.end()
                })
        } else {
            res.write("Error 404: Page not found!")
            res.end()
        }

    } else if (q.pathname.match(/\/genero\/[A-Za-z]+/)) {
        const id = q.pathname.match(/\/genero\/([A-Za-z]+)/)[1]
        if (id) {
            create_genre_movies(id)
                .then(p => {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(p)
                    res.end()

                }).catch(erro => {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(erro.toString())
                    res.end()
                })
        } else {
            res.write("Error 404: Page not found!")
            res.end()
        }

    } else {
        res.write("Error 404: Page not found!")
        res.end()
    }

}).listen(2845)

console.log('Server running on http://localhost:2845/')