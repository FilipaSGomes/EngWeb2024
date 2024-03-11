exports.periodosListPage = function(slist, d){
    // slist is an array of period
    // d is the date
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
            <title>Period Management</title>
        </head>
        <body>
            <div class="w3-card-4">

                <header class="w3-container w3-teal">
                    <h1>Period List
                    <a class="w3-btn w3-round w3-grey" href="/periodos/registo">+</a>
                    </h1>
                    
                </header>
        
                <div class="w3-container">
                <table class="w3-table-all">
                    <tr>
                        <th>Name</th>
                    </tr>

                `
    for(let i=0; i < slist.length ; i++){
        pagHTML += `
                    <tr>
                        <th>
                            <a href="/periodos/${slist[i].nome}">
                                ${slist[i].nome}
                            </a>
                        </th>
                        <th>
                            [<a href="/periodos/edit/${slist[i].nome}">Edit</a>][<a href="/periodos/delete/${slist[i].id}">Delete</a>]
                        </th>
                    </tr>
        `
    }

    pagHTML += `
            </ul>
            </table>
            </div>
                <footer class="w3-container w3-blue">
                    <h5>Generated by FG2024 in ${d}</h5>
                </footer>
            </div>
        </body>
    </html>
    `
    return pagHTML
}


exports.periodoFormPage = function(d){
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
            <title>Period Form</title>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h2>Period Form</h2>
                </header>
            
                <form class="w3-container" method="POST">
                    <fieldset>
                        <legend>Metadata</legend>
                        <label>Name</label>
                        <input class="w3-input w3-round" type="text" name="nome"/>
                    </fieldset>
                    <br/>
                    <button class="w3-btn w3-purple w3-mb-2" type="submit">Register</button>
                </form>

                <footer class="w3-container w3-purple">
                    <h5>Generated by FG2024 in ${d} - [<a href="/">Return</a>]</h5>
                </footer>
            
            </div>
    `
}

exports.periodoFormEditPage = function(a, d){
    periodo = a[0]
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
            <title>Period Form</title>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h2>Period Form</h2>
                </header>
            
                <form class="w3-container" method="POST">
                    <fieldset>
                        <legend>Metadata</legend>
                        <label>Name</label>
                        <input class="w3-input w3-round" type="text" name="nome" value="${a[0].nome}"/>
                    </fieldset>
                    
                    <fieldset>
                        <legend>Composers</legend>
                    `
                    periodo.compositores.forEach(element => {
                        const key = Object.keys(element)[0];
                        const value = element[key];     
                        pagHTML += `<input class="w3-check" type="checkbox" name="${key}" value="${value}" checked/>
                        <label>${value}</label>
                        `             
                    
                    });            
                
    pagHTML += `
                    <button type="button" onclick="selectAllComposers()">Select All</button>
                    </fieldset>  
                    <br/>
                    <button class="w3-btn w3-purple w3-mb-2" type="submit">Register</button>
                </form>

                <footer class="w3-container w3-purple">
                    <h5>Generated by EngWeb2024 in ${d} - [<a href="/">Return</a>]</h5>
                </footer>
            
            </div>
            
            <script>
                function selectAllComposers() {
                    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(function(checkbox) {
                        checkbox.checked = true;
                    });
                }
            </script>
        </body>
    </html>
    `;
    return pagHTML;
}

// ---------------periodo's Page--------------------------------
// Change and adapt to current dataset...
exports.periodoPage = function(p, d){
    periodo = p[0]
    var pagHTML = `
    <html>
    <head>
        <title>${periodo.nome}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Periodo ${periodo.nome}</h1>
            </header>

            <div class="w3-container">
                <ul class="w3-ul w3-card-4" style="width:50%">
                `
    periodo.compositores.forEach(element => {
        const key = Object.keys(element)[0];
        const value = element[key];     
        pagHTML += `
                <li>
                    <a href="/compositores/${key}">
                    ${value}
                    </a>
                </li>
                `
    });
    pagHTML += `
                </ul>
            </div>
            <div class="w3-container w3-margin-8">
                <ul class="w3-ul">
                </ul></div>
            <footer class="w3-container w3-teal">
                <address>Gerado por FG2024 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
    return pagHTML
}

// -------------- Error Treatment ------------------------------
exports.errorPage = function(errorMessage, d){
    return `
    <p>${d}: Error: ${errorMessage}</p>
    `
}