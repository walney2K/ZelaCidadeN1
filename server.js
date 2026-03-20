



const express = require('express')
const {criarBanco} = require('./database')


const app = express ()



app.use(express.json())




app.get('/' , (req, res) => {

    res.send(`
        <body>
        <h1> ZelaCidade </h1>
        <h2> Gestão deproblemas urbanos </h2>
        <p> endpoint que fica aos iniciantes cadastrados: incidentes </p>

        </body>
        
        
        
        
        `);
});



const PORT = 3000;
//Ligando o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});



app.get("/incidentes", async (req, res) => {
    
    const db = await criarBanco()
    
    const listaIncidentes = await db.all(`SELECT * FROM incidentes`)

    res.json(listaIncidentes)
})