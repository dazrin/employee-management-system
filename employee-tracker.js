const mysql = require('mysql');
const inquirer = require('inquirer');

// create connection info for sql database
const connection = mysql.createConnection({
    host: 'localhost',

    // port
    port: 3306,

    // user
    user: 'root',

    // password
    password: 'kingDDom.',
    database: 'employee_DB',
});

// function to prompt user
const start = () => {
    inquirer
    .prompt({
        name: 'something',
        type: '',
        message: '',
        choices: ['CHOICE',],
    })
    .then((answer)) => {
        // do something based on their answer
        if(answer.something === 'CHOICE')
    }
}

