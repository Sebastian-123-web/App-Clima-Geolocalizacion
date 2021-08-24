const inquirer = require('inquirer');
require('colors');

const preguntas = [ // ARREGLO DE PREGUNTAS PARA EL ----> prompt
    {
        type: 'list',
        name: 'opcion',
        message: 'Que desea hacer?',
        choices: [ // LAS OPCIONES QUE APARECERAN PARA SELECCIONAR EN CONSOLA
            {
                value: 1,
                name: `${ '1.'.green } Buscar ciudad`
            },
            {
                value: 2,
                name: `${ '2.'.green } Historial`
            },
            {
                value: 0,
                name: `${ '3.'.green } Salir`
            }
        ]
    }
];

const inquirerMenu = async() => {
    console.clear();
    console.log('========================='.green);
    console.log('  Aplicacion del Clima');
    console.log('=========================\n'.green);

    // prompt ---> MUESTRA LAS PREGUNTAS EN CONSOLA Y ME DEJA SELECCIONARLA CON LAS TECLAS DIRECCIONALES
    const { opcion } = await inquirer.prompt(preguntas);
    // { opcion } ---> esto desestructura el objeto para obtener el valor
    return opcion;
}

const pausa = async() => {
    return await inquirer.prompt({
        type: 'input', // ESTE PERMITE PRESIONAR UNA TECLA
        name: 'enter', // NOMBRE DE LA PREGUNTA
        message: `\nPresione ${ 'ENTER'.green } para continuar` // EL MENSAJE QUE APARECERA EN CONSOLA
    });
}

const leerInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){ // validate ----> es para que el usuario ponga si o si al menos una letra
                if( value.length === 0 ){ // SI EL USUARIO NO ESCRIBIO NINGUNA PALABRA ENTONCES LAS LETRAS TOTALES SON 0
                    return 'Por favor ingrese un valor'; // BOTARA ESTE MENSAJE HASTA QUE EL USUARIO ESCRIBA ALGO
                }
                return true; // true SI EL USUARIO ESCRIBIO ALGO
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async( lugares = [] ) => {
    const choices = lugares.map( (lugar, i) => { //el "map" es un metodo que reemplaza al for
        const idx = `${ i + 1 }.`.green; // es un contador
        return {
            value: lugar.id,
            name: `${ idx } ${ lugar.nombre }`
        }
        /* 
            choise retorna un arreglo y lo que retorna es esto ...
            choise: {
                value: 12345-4578-9874556
                name: 1 Tengo que comer
            }
        */
    });

    choices.unshift({ // "unshift" es para agregar un registro al inicio del arreglo
        value: '0',
        name: '0.'.green + ' Cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices //aqui es "choices: choices" pero eso es redundante en ECMAScript asi que solo se puede poner "choices"
        }
    ]

    const { id } = await inquirer.prompt(preguntas);
    return id;
}

const confirmar = async(message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;
}

const mostrarListafoChecklist = async( tareas = [] ) => {
    const choices = tareas.map( (tarea, i) => { //el "map" es un metodo que reemplaza al for
        const idx = `${ i + 1 }.`.green; // es un contador
        return {
            value: tarea.id,
            name: `${ idx } ${ tarea.desc }`,
            checked: (tarea.completadoEn) ? true : false // esto verifica si una tarea esta completada o no lo esta, marca la tarea como completada
        }
        /* 
            choise retorna un arreglo y lo que retorna es esto ...
            choise: {
                value: 12345-4578-9874556
                name: 1 Tengo que comer
            }
        */
    });

    const preguntas = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccciones',
            choices //aqui es "choices: choices" pero eso es redundante en ECMAScript asi que solo se puede poner "choices"
        }
    ]

    const { ids } = await inquirer.prompt(preguntas);
    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListafoChecklist
}