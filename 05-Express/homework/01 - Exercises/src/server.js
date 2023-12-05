const express = require("express");
const server = express();
let publications = [{
    author: "elmasalla",
    title: "Probandooo",
    contents: "Express está buenisimo, solo que no se usarlo aún"
}];

server.use(express.json());

// server.httpMethod(path, CONTROLLERcb(req,res) =>{
//     req->ver request de params, query o body
//     res-> responder segun req, con .status(codigo) .json o .send
// })

server.post("/posts", (req, res) => {
    //analizar request, segun body
    let { author, title, contents } = req.body
    //validation
    if (author && title && contents) {
        const postObj = {
            author: author,
            title: title,
            contents: contents,
            // COMO LE ASIGNO NÚMERO DE ID?
            // ver esta formula para crear id unico
            //             const idExistente = [];

            // function generarNuevoId() {
            //   // Genera un nuevo ID aleatorio
            //   const nuevoId = Math.floor(Math.random() * 1000) + 1;

            //   // Verifica si el ID ya existe en el array idExistente
            //   if (idExistente.includes(nuevoId)) {
            //     // Si ya existe, llama recursivamente para generar otro ID
            //     return generarNuevoId();
            //   }

            //   // Si no existe, agrega el nuevo ID al array y devuélvelo
            //   idExistente.push(nuevoId);
            //   return nuevoId;
            // }

            // // Ejemplo de uso
            // const nuevoId = generarNuevoId();
            // console.log(nuevoId);
        }
        publications.push(postObj)
        return res
            .status(200)
            .json(postObj)
    } else {
        res
            .status(404) // qué cod sería? error cliente 400s
            .json({ error: "No se recibieron los parámetros necesarios para crear la publicación" })

    }
})


//query: ruta /posts?author=${author}?title=${title}.
//pero query no va en path
server.get("/posts", (req, res) => {
    let { author, title } = req.query;
    //FILTER porque dicen que pueden ser varios posts con =titulo y autor
    let postsReq = publications.filter(
        post => post.author === author && post.title === title
    )
    if (postsReq) {
        return res
            .status(200)
            .json(postsReq)
    } else {
        return res
            .status(404)
            .json({ error: "No existe ninguna publicación con dicho título y autor" })

    }

})


server.get("/posts/:author", (req, res) => {
    let { author } = req.params
    const authorReq = publications.filter(
        post => post.author === author
    )

    if (authorReq) {
        return res.status(200).json(authorReq)
    } else {
        return res.status(200).json({ error: "No existe ninguna publicación del autor indicado" })
    }
})


//NO MODIFICAR EL CODIGO DE ABAJO. SE USA PARA EXPORTAR EL SERVIDOR Y CORRER LOS TESTS
module.exports = { publications, server };
