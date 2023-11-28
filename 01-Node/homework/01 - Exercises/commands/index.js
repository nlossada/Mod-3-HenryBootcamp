const fs = require("fs");
const utils = require("../utils/request");
const process = require("process");


function pwd(print, args) {
    print(process.cwd()) //ejecuto el método de process
}

function date(print, args) {
    print(Date())  //date es de js, no de process
}

function echo(print, args) {
    print(args)
}

function ls(print, args) {
    fs.readdir(".", (error, files) => {
        // el "." es donde se ejecuta fun bash, busca todo en esa carpeta
        // FILES trae array, print necesita sting
        // if para manejo del error como promesa
        if (files) print(files.join(" "))
        else throw error
    })

}

//puede leer archivo md, txt
function cat(print, args) {
    // metodo read tiene estos params, que archivo leer args, que lenguaje "humano" y un cb promesa
    fs.readFile(args, "utf-8", (error, data) => {
        if (error) throw new Error(error);
        //error corta ejecución, si sigue corriendo es porque no hubo error
        print(data)
    })
}

//imprime primer linea 
function head(print, args) {
    fs.readFile(args, "utf-8", (error, data) => {
        if (error) throw new Error(error);
        const firstLine = data.split("\n")[0]
        // data convierto a array por salto de línea
        print(firstLine)
    })
}

function tail(print, args) {
    fs.readFile(args, "utf-8", (error, data) => {
        if (error) throw new Error(error);
        const lastLine = data.split("\n").pop().trim(); // me quedo con ultima línea
        print(lastLine);
    })
}

function curl(print, args) {
    // if (args.includes("https://")) {
    utils.request(args, (error, response) => {
        if (error) throw new Error(error);
        //si no hay error, sigue corriendo e imprime resp
        print(response)
    })
    // } else {
    //     throw new Error("Debe ingresar URL --> https://")
    // }
}


// correr con nodemon y probar los comandos en la consola luego del propmt > que se imprime por func bash
module.exports = {
    pwd, date, echo, ls, cat, head, tail, curl
};
