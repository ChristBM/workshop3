/* La key que le dan a los usuario que se suscribe a la API para que puedan usarla */
const API_key = 'appid=dbe836383292e4bfe31ce5f40a954007' /* mi key */
/* url para las consultas de datos y de iconos */
const URL_base = 'https://api.openweathermap.org/data/2.5/weather?' /* para traer el objeto JSON con los datos del clima */
const URL_icono = 'http://openweathermap.org/img/wn/' /* hay que concatenarle el icono.png */
/* Parametros de configuración de la API */
let lenguaje = 'lang=en' /* es Español, en Inglés */
/* La temperatura está por defecto en grados Kelvin */
const celcius = 'units=metric' /* °C */
const fahrenheit = 'units=imperial' /* °F */
/* Si quiere buscar por ciudad */
const parametroCiudad = 'q='
let ciudad = ''
/* Si quiere buscar por código postal */
const parametroZipCode = 'zip='
let zipCode = 0
/* Si quiere buscar por el id de la ciudad, estos ID están en una lista dada por los creadores de la API */
const parametroId = 'id='
let id_pais = 0
/* Si quiere buscar por coordenadas */
const parametroLat = 'lat='
const parametroLong = 'long='
let longitud = 0
let latitud = 0

/* Elementos de entrada del header, input y button */
const botonConsultar = document.querySelector('#traer_pronostico')
const inputCity = document.querySelector('.input__style')
const app_cards_container = document.querySelector('#cardsContainer')
const botonLang = document.querySelector('.btn__lang')
let title_header = document.querySelector('header > h1')
const mensajeInfo = document.querySelector('.message')
/* Funión para consultar la API y traer la información del clima para esa ciudad */
function eliminarCard(event){
    event.path[1].remove()
}
async function fetchWeather( city ) {
    let url_fetch = ''
    let CoF = ''
    let pres = ''
    let hume = ''
    let vientos = ''
    let viento_unidades = ''
    if( lenguaje === 'lang=en' ){
        url_fetch = `${URL_base}${parametroCiudad}${city}&${lenguaje}&${fahrenheit}&${API_key}`
        CoF = '°F'
        pres = 'Pressure:'
        hume = 'Humidity:'
        vientos = 'Wind:'
        viento_unidades = 'mi/h'
    }
    else{
        url_fetch = `${URL_base}${parametroCiudad}${city}&${lenguaje}&${celcius}&${API_key}`
        CoF = '°C'
        pres = 'Presión:'
        hume = 'Humedad:'
        vientos = 'Vientos:'
        viento_unidades = 'm/s'
    }
    try{
        const response = await fetch( url_fetch )
        const data = await response.json()
        /* Contenedor de la Tarjeta */
        const card = document.createElement('div')
        card.className = 'card selectDisable'
        /* País donde queda la ciudad */
        const pais = document.createElement('div')
        pais.className = 'card__pais'
        pais.textContent = `${data.sys.country}`
        /* Botón para cerrar la tarjeta */
        const btn_close = document.createElement('button')
        btn_close.className = 'card__close'
        btn_close.innerHTML = 'X'
        btn_close.addEventListener( 'click', eliminarCard )
        /* Nombre de la ciudad */
        const title = document.createElement('h2')
        title.className = 'card__titulo'
        let name = data.name.toUpperCase()
        if( name.length >= 13 ){
            title.textContent = name
            title.style.fontSize = '2rem'
            title.style.textAlign = 'center'
        }
        else if( name.length >= 20 ){
            title.textContent = name
            title.style.fontSize = '1rem'
            title.style.textAlign = 'center'
        }
        else{
            title.textContent = name
        }
        /* Temperatura */
        const temperature = document.createElement('p')
        temperature.className = 'card__temperature'
        temperature.textContent = `${data.main.temp}${CoF}`
        /* Icono del cielo en esa ciudad */
        const icon = document.createElement('div')
        icon.className = 'card__icon'
        icon.style.backgroundImage = `url('${URL_icono}${data.weather[0].icon}@2x.png')`
        icon.style.backgroundRepeat = 'no-repeat'
        icon.style.backgroundPosition = 'center'
        icon.style.backgroundSize = 'cover'
        /* Descripción del Cielo */
        const resume = document.createElement('p')
        resume.className = 'card__resume'
        resume.textContent = data.weather[0].description
        /* Presión Atmosférica */
        const presion = document.createElement('p')
        presion.className = 'card__presion'
        presion.textContent = `${pres} ${data.main.pressure} hPa`
        /* Humedad Relativa */
        const humedad = document.createElement('p')
        humedad.className = 'card__humedad'
        humedad.textContent = `${hume} ${data.main.humidity} %`
        /* Velocidad de los vientos */
        const viento = document.createElement('p')
        viento.className = 'card__viento'
        viento.textContent = `${vientos} ${data.wind.speed} ${viento_unidades}`
        /* Agrego cada elemento a la Card y luego la posiciono dentro del contenedor de tarjetas */
        card.append( pais, btn_close, title, temperature, icon, resume, presion, humedad, viento )
        app_cards_container.insertAdjacentElement( 'afterbegin', card )
    }
    catch( err ){
        console.log( err )
        if( lenguaje === 'lang=en' ){
            mensajeInfo.textContent = 'City not found'
            setTimeout( () => {
                mensajeInfo.textContent = ''
            }, 2000 )
        }
        else{
            mensajeInfo.textContent = 'Ciudad no hallada'
            setTimeout( () => {
                mensajeInfo.textContent = ''
            }, 2000 )
        }
    }
}
function filtrarCiudad() {
    if(ciudad != ''){
        let city = ciudad.replace( /\s/g, '+').toLowerCase()
        ciudad = city
        fetchWeather( city )
    }
    else{
        if( lenguaje === 'lang=en' ){
            mensajeInfo.textContent = 'Please, enter a city'
            setTimeout( () => {
                mensajeInfo.textContent = ''
            }, 2000 )
        }
        else{
            mensajeInfo.textContent = 'Escriba una ciudad'
            setTimeout( () => {
                mensajeInfo.textContent = ''
            }, 2000 )
        }
    }
}
function comprobarInput() {
    ciudad = inputCity.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
function enterPress(event) {
    if(event.key === 'Enter'){
        filtrarCiudad()
    }
}
function cambiarIdioma() {
    if(lenguaje === 'lang=en'){
        lenguaje = 'lang=es'
        botonLang.style.transform = 'translateX(0%)'
        title_header.textContent = 'Una Simple App del Clima'
        title_header.style.textAlign = 'center'
        botonConsultar.innerHTML = 'Consultar!'
        inputCity.placeholder = 'Búsqueda por ciudad'
        console.log(inputCity.placeholder)
    }
    else{
        lenguaje = 'lang=en'
        botonLang.style.transform = 'translateX(100%)'
        title_header.textContent = 'Simple Weather App'
        botonConsultar.innerHTML = 'Submit!'
        inputCity.placeholder = 'Search for a city'
    }
}
/* Eventos */
inputCity.addEventListener( 'input' , comprobarInput )
botonConsultar.addEventListener( 'click', filtrarCiudad )
document.addEventListener( 'keydown', enterPress )
botonLang.addEventListener( 'click', cambiarIdioma )