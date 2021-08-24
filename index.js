require('dotenv').config()

const { leerDB } = require('../04-app-tareas/helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() =>{
    const busquedas = new Busquedas();
    let opt;
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // Mostrar mensaje
                    const termino = await leerInput('Cuidad: ');

                //Buscar los lugares
                    const lugares = await busquedas.ciudad(termino);
                    
                //seleccionat el lugar
                    const id = await listarLugares(lugares);
                    if ( id === '0' ) continue; 

                    const lugarSel = lugares.find( l => l.id === id );
                
                //Guardar en DB
                    busquedas.agregarHistorial( lugarSel.nombre );

                //clima
                    const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                //mostrar resultados
                console.clear();
                console.log('\nInformacion de la cuidad\n'.green);
                console.log('Cuidad:', lugarSel.nombre.green );
                console.log('Lat:', lugarSel.lat );
                console.log('lng:', lugarSel.lng );
                console.log('Temperatura:', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Maxima:', clima.max);
                console.log('Como esta el clima:', clima.desc.green);

            break;
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ lugar }`);
                });
            break;
        }
        if ( opt !== 0 ) await pausa();
    } while (opt !== 0);
}

main();