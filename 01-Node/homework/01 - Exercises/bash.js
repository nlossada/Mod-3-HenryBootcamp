const process = require('process');
// el process viene de node, tenga o no instalados los node modules
const { Z_ASCII } = require('zlib');
const commands = require('./commands/index.js');

// console.log(process.stdout.write)


function print(output) {
   process.stdout.write(output);
   process.stdout.write("\nprompt > ")
}
//fun bash ve que hay que hacer y deriva a los comandos de index.js

function bash() {
   //muestra el promp > para que ingreses en consola comando y args
   process.stdout.write("prompt > ")
   //stdout write escribe en la consola
   process.stdin.on("data", (data) => {
      //stdin.on captura data escrita en la consola luego del prompt >
      // prompt > leer data.txt
      //fun stdin data => leer ( es el cmd) data.txt (es args)
      // data viene como buffer, no es json
      let args = data.toString().trim().split(" ") // guardo un array para separar cmd de args
      let cmd = args.shift() // saco primer elemento (ej leer cmd) y el args me queda sin el cmd
      // verificar si el cmd ingresado coincide con algun commands de index.js
      args = args.join(" ") // lo vuelvo a string, porque las funciones esperan str no array
      if (commands.hasOwnProperty(cmd)) {
         //commands[cmd], trae por [prop] del obj command: es una función del index.js
         commands[cmd](print, args);
      } else {
         print(`command not found: ${cmd}`)
      }
   })
}
//refactorizado el if --> usar ternario se usa mas
// commands[cmd] 
//    ? commands[cmd] (print, args)
//    : print (`command not found: ${cmd}`);

bash();

module.exports = {
   print,
   bash,
};
