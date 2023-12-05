"use strict";

let exerciseUtils = require("./utils");

let args = process.argv.slice(2).map(function (st) {
  return st.toUpperCase();
});

module.exports = {
  problemAx: problemA,
  problemBx: problemB,
  problemCx: problemC,
  problemDx: problemD,
};

// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function (arg) {
  let problem = module.exports["problem" + arg];
  if (problem) problem();
});



async function problemA() {
  // callback version
  // exerciseUtils.readFile("poem-one/stanza-01.txt", function (err, stanza) {
  //   exerciseUtils.blue(stanza);
  // });
  // exerciseUtils.readFile("poem-one/stanza-02.txt", function (err, stanza) {
  //   exerciseUtils.blue(stanza);
  // });

  // async await version
  // Tu código acá:
  //!promise.all -> espera array de promesas devuelve array de response
  await Promise.all([ //el await antes es para que se ejecute console.log ultimo, que espere todo bloque promise.all
    exerciseUtils.blue(await exerciseUtils.promisifiedReadFile("poem-two/stanza-01.txt")),
    exerciseUtils.blue(await exerciseUtils.promisifiedReadFile("poem-two/stanza-02.txt"))
  ])
  console.log("done") // sin await ANTES DE PROMISE.ALL, este consolle.log se ejecutaría antes, promise.all va TODO BLOQUE a web api y sigue corriendo al console log
}



async function problemB() {
  let filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });

  // callback version
  // filenames.forEach((filename) => {
  //   exerciseUtils.readFile(filename, function (err, stanza) {
  //     exerciseUtils.blue(stanza);
  //   });
  // });

  // async await version
  // Tu código acá:
  //! no orden, solo simultaneo --> usar promise.all o forEach (no es controlador de flujo)
  filenames.forEach(async (filename) => exerciseUtils.blue(
    await exerciseUtils.promisifiedReadFile(filename)
  ))
  //el await dentro del cb del método -> pide que la cb sea async
}




async function problemC() {
  let filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });

  // callback version
  // filenames.forEach((filename) => {
  //   exerciseUtils.readFile(filename, function (err, stanza) {
  //     exerciseUtils.blue(stanza);
  //   });
  // });

  // async await version
  // Tu código acá:
  //! EN ORDEN Y EN SERIE, usar for (sin manejo del error)
  for (let i = 0; i < filenames.length; i++) {
    exerciseUtils.blue(
      await exerciseUtils.promisifiedReadFile(filenames[i])
    )
  }
  console.log("done")
}




async function problemD() {
  let filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });
  let randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = "wrong-file-name-" + (randIdx + 1) + ".txt";

  // callback version
  // filenames.forEach((filename) => {
  //   exerciseUtils.readFile(filename, function (err, stanza) {
  //     exerciseUtils.blue(stanza);
  //     if (err) exerciseUtils.magenta(new Error(err));
  //   });
  // });

  // async await version
  // Tu código acá:
  //! EN ORDEN Y EN SERIE, usar for (con manejo del error try catch)
  try {
    for (let i = 0; i < filenames.length; i++) {
      exerciseUtils.blue(
        await exerciseUtils.promisifiedReadFile(filenames[i])
      )
    }
  } catch (error) {
    exerciseUtils.magenta(new Error(error));
  } finally {
    console.log("done");
  }
}
