'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

function $Promise(executor) {
    if (typeof executor !== "function") throw TypeError("executor must be a function");
    this._state = "pending";
    // executor debe ejecutarse y conectarse con los métodos para resolverse, y deben ejecutarse en las instancias por eso aplico bind al this--> la instancia cuando se aplica
    // resol optimista, primero fulfilled y luego rejected
    //this es la func constructora, al aplicar bind le digo:toma tu propio this, el this en la instancia
    this._handlerGroups = [];
    executor(
        this._internalResolve.bind(this), // bindear al this, sería para ejecutar metodos en la instancia-->this
        this._internalReject.bind(this)
    );
};

//agrego método a la fun constructora
$Promise.prototype._internalResolve = function (data) {
    //state cambia una sola vez (no tomar value para if, no confiable, pueden enviar valores falsy) -->solo si la promesa esta en pending puede cambiar!!
    if (this._state === "pending") {
        this._state = "fulfilled";
        this._value = data;
    }
    this.callHandlers();
}

$Promise.prototype._internalReject = function (reason) {
    if (this._state === "pending") {
        this._state = "rejected";
        this._value = reason;
    }
    this.callHandlers();
}

//ejecuta todos los handlers de handleGroups [{},{}] segun como resolvio
// el handleGroups es QUEUE, primero entrado, primero salido
$Promise.prototype.callHandlers = function () {
    while (this._handlerGroups.length) {
        //me quedo con el {} del primer then
        const hd = this._handlerGroups.shift();
        //este mét lo invoca directamente la instancia--> this es la instancia
        // si promesa fullfilled, ver si existe successCb y ejecutar
        if (this._state === "fulfilled") {
            // ? FULFILLED
            if (hd.successCb) {
                // * FULFILLED CON succesHandler
                try {
                    const result = hd.successCb(this._value)
                    if (result instanceof $Promise) {
                        // * resuelve a PROMISE
                        // Asimilación
                        return result.then(
                            data => hd.downstreamPromise._internalResolve(data),
                            error => hd.downstreamPromise._internalReject(error)
                        )
                    } else {
                        // * resuelve a DATA
                        hd.downstreamPromise._internalResolve(result);
                    }
                } catch (error) {
                    hd.downstreamPromise._internalReject(error);
                }
            } else {
                // * FULFILLED SIN succesHandler
                hd.downstreamPromise._internalResolve(this._value)
            }
        } else if (this._state === "rejected") {
            // ! REJECTED
            if (hd.errorCb) {
                // * CON errorHandler
                try {
                    // result dentro del "try-catch" !!!!! !!!!!
                    const result = hd.errorCb(this._value);
                    if (result instanceof $Promise) {
                        // * succesHandler resuelve a PROMESA
                        return result.then(
                            data =>
                                hd.downstreamPromise._internalResolve(data),
                            error =>
                                hd.downstreamPromise._internalReject(error)
                        )
                    } else {
                        // * succesHandler resuelve a  DATA
                        hd.downstreamPromise._internalResolve(result);
                    }
                } catch (error) {
                    hd.downstreamPromise._internalReject(error);
                }
            } else {
                // * SIN errorHandler
                hd.downstreamPromise._internalReject(this._value);
            }

        }
    }
}

//! THEN
//then (successHandlerCb, errorHandlerCB)
//then encadenados, voy guardando en _handlerGroups array de success y de errors de CADA INSTANCIA DE PROMESAS
// _handlerGroups = [{successCb:"s1", errorCb: "e1"}, {successCb:"s2", errorCb: "e2"}]
// puedo no pasar nada en successCb o en errorCb, avisar con un falsy que no ejecute el cb
$Promise.prototype.then = function (successCb, errorCb) {
    if (typeof successCb !== "function") successCb = false;
    if (typeof errorCb !== "function") errorCb = false;
    this._handlerGroups.push({ successCb, errorCb })
    if (this._state !== pending) this.callHandlers(); //solo ejectuto handlers si no es pending
}

//! CATCH
//Para catch uso el then solo en el error
$Promise.prototype.catch = function (errorCb) {
    return this.then(null, errorCb)
}

//la constructora Promise genera {_status: empieza en pending}
// prop de constructora con _prop signnifica que solo debe ser modif por sus metodos, no por fuera
//myNewPromise es una inst de constructora
const myNewPromise = new $Promise((resolve, reject) => {
    if ("condition") resolve("DATA")
    else reject("REASON")

})



module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
