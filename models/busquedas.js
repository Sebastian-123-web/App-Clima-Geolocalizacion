const fs = require('fs');
const axios = require('axios');

class Busquedas{
    historial = [];
    dbPath = './db/database.json';

    constructor(){
        // TODO: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {
            let palabra = lugar.split(' ');
            palabra = palabra.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabra.join(' ')
        } )
    }

    get paramsMapbox(){
        return {
            'access_token' : process.env.MAPBOX_KEY,//aqui llamamos a una variable de entorno que hemos creado en .env
            'limit' : 5,
            'language' : 'es'
        }
    }
    get paramsOpenweather(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad( lugar = '' ){
        try {
            //peticion http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            throw [];
        }
    }

    async climaLugar( lat, lon ){
        try {
            //intance axios.create()
            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${ lon }`,
                params: this.paramsOpenweather
            });
            //resp.data
            const resp = await intance.get();
            const { weather, main } = resp.data;
            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = '' ){
        if (this.historial.includes( lugar.toLocaleLowerCase() )) {
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift( lugar.toLocaleLowerCase() );

        //Grabar en DB
        this.guardarDB();

    }

    guardarDB(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        // debe de existir
            if ( !fs.existsSync(this.dbPath) ) {
                return null
            }

            const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' }) ;
            const data = JSON.parse(info);
            this.historial = data.historial;
    }
}

module.exports = Busquedas;