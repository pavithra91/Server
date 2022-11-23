const schedule = require('node-schedule');
const fetch = require('node-fetch');
const { Headers } = fetch;
require("dotenv").config();
const fs = require("fs");
const os = require("os");

schedule.scheduleJob('* 0 0 * * *', () => {

    var myHeaders = new Headers();
    myHeaders.append("apikey", "EJ1QZD9FbGdWJro19NOVu0Iz70lW4UMV");

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    fetch("https://api.apilayer.com/exchangerates_data/latest?symbols=NGN&base=LKR", requestOptions)
        .then(response => response.text())
        .then(result => {
            let str = JSON.parse(result);
            //   process.env[EXCHANGE_RATE] = str.rates.NGN;
            setEnvValue('EXCHANGE_RATE', str.rates.NGN)
            console.log(str.rates.NGN);
        }
        )
        .catch(error => console.log('error', error));
})

function setEnvValue(key, value) {
    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
    }));

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);

    // write everything back to the file system
    fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));
}