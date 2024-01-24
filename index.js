#!/usr/bin/env node

const https = require("https");
const readline = require("readline");
require("dotenv").config();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const apiKey = process.env.myAPIKey;

function getWether() {
  rl.question("Введите город: ", (city) => {
    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${apiKey}`;
    https
      .get(url, (response) => {
        const { statusCode } = response;

        if (statusCode !== 200) {
          console.log("Error: ", statusCode);
          return;
        }

        response.setEncoding("utf8");
        let rowDate = "";
        response.on("data", (chunk) => (rowDate += chunk));
        response.on("end", () => {
          let parseData = JSON.parse(rowDate);
          const { temperature, windSpeed, visibility } = parseData.data.values;
          console.log(`Погода в городе ${parseData.location.name}`);
          console.log(`Температура: ${temperature} (°C)`);
          console.log(`Скорость ветра: ${windSpeed} (m/s)`);
          console.log(`Видимость: ${visibility} (km)`);
          rl.question("Узнать в другом городе? (y/n): ", (res) => {
            if (res.toLowerCase() === "y") {
              getWether();
            } else {
              rl.close();
            }
          });
        });
      })
      .on("error", (err) => console.log("Error ", err));
  });
}

getWether();