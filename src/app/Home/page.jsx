"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import familywalk from "/public/familywalk2.gif";
import avobee from "/public/avobee.png";
import snowgif from "/public/snow.gif";
import raingif from "/public/rain.gif";
import clouds from "/public/clouds.png";
import summer from "/public/avosummer.png";
import finger from "/public/avofinger.png";
import rain from "/public/avorain.png";
import thunder from "/public/avothunder.png";
import angry from "/public/avoangry.png";
import cloudy from "/public/cloudyavo.png";
import freezing from "/public/freezing.png";

export default function Home() {
  const router = useRouter();
  const { query } = useSearchParams();
  const city = query ? query.city : null;
  const [text, setText] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isCitySearched, setIsCitySearched] = useState(false);
  const [temperature, setTemperature] = useState(null);

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${"91f56e00e39805ff79afb198e30b28bf"}`
      );
      const result = await response.json();
      if (result.cod === "404") {
        setError("City not found. Try again");
        setWeather(null);
        setText("");
        setTemperature(null);
      } else {
        setWeather(result);
        setError("");
        setTemperature(result.main.temp);
        setText("");
        setIsCitySearched(true);
        setTemperature(result.main.temp);
      }
    } catch (error) {
      setError("City not found. Try again");
      setWeather(null);
      setText("");
      setTemperature(null);
    }
  };

  useEffect(() => {
    console.log("City from query:", city);

    if (!city) {
      setError("");
      setWeather(null);
      setIsCitySearched(false);
      return;
    }
    if (city) {
      fetchWeather(city);
      setIsCitySearched(true);
    }
  }, [city]);

  const weatherImages = {
    Clear: avobee,
    Snow: snowgif,
    Rain: raingif,
    Clouds: clouds,
  };

  const weatherIcons = {
    Clear: summer,
    Snow: finger,
    Rain: rain,
    Thunderstorm: thunder,
    Drizzle: angry,
    Clouds: cloudy,
    Mist: cloudy,
  };
  function getWeatherImage() {
    if (weather && weather.weather && weather.weather.length > 0) {
      switch (weather.weather[0].main) {
        case "Snow":
          return (
            <Image
              src={snowgif}
              alt="Snow"
              className=" w-full h-full absolute top-0 "
              layout="responsive"
              priority={true}
            />
          );
        case "Rain":
          return (
            <Image
              src={raingif}
              alt="Rain"
              className=" w-full h-[90%] absolute top-0 "
              layout="responsive"
              priority={true}
            />
          );
        case "Clouds":
          return (
            <Image
              className=" absolute object-cover h-full bottom-0"
              layout="responsive"
              src={clouds}
              alt="Clouds"
              priority={true}
            />
          );
      }
    }
    return null;
  }
  function getWeatherIcons() {
    const isFreezingClear =
      temperature - 273.15 < 0 && weather.weather[0].main === "Clear";
    console.log("Temperature:", temperature);
    console.log("Weather Main:", weather?.weather[0]?.main);
    console.log("Is Freezing Clear:", isFreezingClear);
    switch (weather?.weather[0].main) {
      case "Snow":
        return (
          <Image
            src={finger}
            alt="Snow"
            className=" ml-48 w-48"
            layout="responsive"
            priority={true}
          />
        );
      case "Rain":
        return (
          <Image
            src={rain}
            alt="Rain"
            className="w-80 h-80"
            layout="responsive"
            priority={true}
          />
        );
      case "Clouds":
        return (
          <Image
            src={cloudy}
            alt="Clouds"
            className=" w-40 h-96 z-20  "
            layout="responsive"
            priority={true}
          />
        );
      case "Clear":
        return isFreezingClear ? (
          <Image
            className="w-full h-full rounded-full "
            src={freezing}
            alt="freezing avocado"
            layout="responsive"
            priority={true}
          />
        ) : (
          <Image
            src={summer}
            alt="Clear"
            className="h-80 w-80 "
            layout="responsive"
            priority={true}
          />
        );
      default:
        return null;
    }
  }

  const imgBackground = weather && weatherImages[weather.weather[0].main];
  const imgIcon = weather && weatherIcons[weather.weather[0].main];
  const [isCelsius, setIsCelsius] = useState(true);

  function toggleTemperature() {
    setIsCelsius(!isCelsius);
  }

  function convertTemperature() {
    if (weather && temperature !== undefined) {
      let convertedTemperature = temperature - 273;
      if (!isCelsius) {
        convertedTemperature = temperature;
      }
      return (
        <span>
          {Math.round(convertedTemperature)}°{isCelsius ? `C` : `F`}
        </span>
      );
    }
    return null;
  }

  function handleSearch() {
    fetchWeather(text);
  }

  return (
    <main className="flex flex-col items-center justify-around bg-[rgb(210,248,210)]  min-h-screen min-w-screen">
      <h1 className="z-20 text-3xl  text-center font-bold text-[rgb(160,82,45)]">
        {isCitySearched ? weather?.name || "WeatherCado" : "WeatherCado"}
      </h1>
      <div className="flex flex-col items-center  w-full">
        <div className=" w-full flex justify-center items-center mt-10 h-[200px]">
          {getWeatherImage() || getWeatherIcons || (
            <Image priority={true} src={familywalk} alt="family walk gif" />
          )}

          {imgIcon && (
            <div className="flex flex-col items-center text-center z-20 ">
              {/* <span className="text-[rgb(160,82,45)]">{weather.name}</span> */}

              <div className="text-7xl text-[rgb(160,82,45)]">
                {convertTemperature()}
              </div>
              <span className="text-2xl text-[rgb(160,82,45)]">
                {weather.weather[0].main}
              </span>
              {getWeatherIcons()}
              <button
                onClick={toggleTemperature}
                className="text-[rgb(160,82,45)]"
              >
                {isCelsius ? "press for °F" : "press for °C"}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 z-20 mt-32 ">
          <input
            className="rounded-full px-4 py-2 text-center placeholder-amber-950 bg-[rgb(160,82,45)] border-[rgb(136 19 55)] w-full"
            value={text}
            placeholder="Find a city"
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="border-2 border-[rgb(136 19 55)] bg-[rgb(160,82,45)] py-2 w-1/2 rounded-full text-amber-950 font-semibold"
          >
            Search
          </button>
        </div>
      </div>
    </main>
  );
}
