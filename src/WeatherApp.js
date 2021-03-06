import React, { useEffect, useState } from 'react';

const WeatherApp = () => {
    // Recoge los datos del clima según la pocisión
    const getWeather = async (coords) => {
        const url = `https://api.weatherapi.com/v1/current.json?key=021a1f5a9a0446cc9cb24347210207&q=${coords}&aqi=no`;
    
        const data = await fetch(url).then(res => res.json());
      
        return data;
    }
    // Encuentra las coordenadas
    const success = (position) => {
        setPlaceCoords(`${position.coords.latitude},${position.coords.longitude}`);
    }
    // Avisa de que no se puede encontrar el dispoditivo
    const error = () => {
        alert("No me se tu lugar compa");
    };

    // Estado que almacena los datos de la API del clima
    const [weather, setWeather] = useState(null);

    // Estado que almacena las coordenadas de la API de geolocalización
    const [placeCoords, setPlaceCoords] = useState("");

    // Estado donde se guarda la información que necesitamos solamente
    const [info, setInfo] = useState({
        city: "",
        state: "",
        temp_c: "",
        temp_f: "",
        wind_speed: "",
        clouds: "",
        pressure: "",
        icon: "https://cdn4.iconfinder.com/data/icons/file-transferring/32/196-01-512.png"
    })

    // Estado para mostrar la temperatura sean celcius o farenheit
    const [tempShowed, setTempShowed] = useState("");

    // Contiene el display del texto Loading...
    const [loadingDisplay, setLoadingDisplay] = useState("block");

    // Contiene el display de los datos de la app
    const [appDisplay, setAppDisplay] = useState("none");

    // Estado para animar el text loading...
    const [loadingText, setLoadingText] = useState("LOADING");

    // Este efecto se estará repitiendo, crea la animación del texto Loading...
    useEffect( () => {
        setTimeout( () => {
            if (loadingText.slice(7,loadingText.length) === "...") {
                setLoadingText("LOADING");
            } else {
                setLoadingText(loadingText + ".");
            }
        }, 300 )
    }, [loadingText] )

    // Este efecto busca el dispositivo, cuando lo encuentra obtiene los datos de su clima, y después los guarda en info
    // (por su naturaleza, esta función se ejecuta 3 veces al iniciar la página)
    useEffect(() => {
        const findPlace = () => {
            if (!(weather)) {
                // Cuando weather es null
                if (placeCoords) {
                    // Cuando tenemos coordenadas pero no datos en weather
                    getWeather(placeCoords).then(data => setWeather(data));
                } else {
                    // Cuando no tenemos ni coordenadas ni datos en weather
                    if ('geolocation' in navigator) {
                        navigator.geolocation.getCurrentPosition( success, error );
                    } else {
                        alert("AAAAAAAAAAAAAAAAAAAA");
                    }
                }
            } else {
                // Cuando weather tiene datos
                setInfo({
                    city: `${weather.location.name}, ${weather.location.country}`,
                    state: weather.current.condition.text,
                    temp_c: `${weather.current.temp_c} °C`,
                    temp_f: `${weather.current.temp_f} °F`,
                    wind_speed: `${weather.current.wind_kph} k/h`,
                    clouds: `${weather.current.cloud} %`,
                    pressure: `${weather.current.pressure_mb} mb`,
                    icon: weather.current.condition.icon
                })

                // Como weather ya tiene datos, es momento de mostrarlos
                setLoadingDisplay("none");
                setAppDisplay("flex");
            }
        }
        findPlace();
    }, [weather,placeCoords])

    useEffect( () => {
        // Cuando info se actualice
        if (info.temp_c) {
            setTempShowed(info.temp_c);
        }
    }, [info] )

    return (
        <div className = "weather-app">
            <div style = {{display: loadingDisplay}}>
                <h4>{loadingText}</h4>
            </div>
            <div style = {{display: appDisplay}} className = "weather-titles">
                <h1>Weather App</h1>
                <h3>{info.city}</h3>
            </div>
            <div style = {{display: appDisplay}} className = "weather-info">
                <div>
                    <h6>{info.state}</h6>
                    <div className = "weather-image-container">
                        <img src = {info.icon} alt = "ícono de prueba"/>
                    </div>
                    <h4>{tempShowed}</h4>
                </div>
                <div>
                    <p><span><b>Wind speed: </b>{info.wind_speed}</span></p>
                    <p><span><b>Clouds: </b>{info.clouds}</span></p>
                    <p><span><b>Pressure: </b>{info.pressure}</span></p>
                </div>
            </div>
            <div style = {{display: appDisplay}} className = "buttons-container">
                <button onClick = { () => {
                    if ('geolocation' in navigator) {
                        navigator.geolocation.getCurrentPosition( success, error );
                    } else {
                        alert("AAAAAAAAAAAAAAAAAAAA");
                    }
                }
                }>Update Position</button>
                <button onClick = { () => {
                    if (tempShowed === info.temp_c) {
                        setTempShowed(info.temp_f);
                    } else {
                        setTempShowed(info.temp_c);
                    }
                } }>Change °C / °F</button>
            </div>
        </div>
    )
}

export default WeatherApp;