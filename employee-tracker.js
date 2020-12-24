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

// connect to sql server and sql database
connection.connect( (err) => {
    if (err) throw err;
    start();
});

// function to prompt user
const start = () => {
    inquirer
    .prompt({
        name: 'question',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all Employees',
            'View all Employees by Department',
            //'View all Employees by Manager',
            'Add Employee',
            'Remove Employee',
            'Update Employee',
            'Update Employee Role',
            'Add Role',
            //'Remove Role',
            //'Update Employee Manager',
            'End'
        ],
    })

    .then(({answer}) => {
        // do something based on their answer
        switch (task) {
            case "View all Employees":
                viewEmployee();
                break;
            case "View all Employees by Department":
                viewEmployeeByDepartment();
                break;
            case "View all Employees by Manager":
                viewEmployeeByManager();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee":
                updateEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Add Role":
                addRole();
                break;
            // case "Remove Role":
            //    removeRole();
            //    break;
            // case "Update Employee Manager":
            //    updateEmployeeManager();
            //    break;
            case "End":
                connection.end();
                break;
        }
    });
};

// view employees

const viewEmployee = () => {
    console.log("Viewing Employees\n");

    var query =
    `SELECT e.id e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
    ON m.id = e.manager_id
    `
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        console.log("Employees viewed!\n");

        question();
    });
}

// view employees by department

const viewEmployeeByDepartment = () => {
    console.log("Viewing employees by department\n");

    var query = 
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name
    `

    connection.query(query, (err, res) => {
        if (err) throw err;

        const departmentChoices = res.map(data => ({
            value: data.id, name: data.name
        }));

        console.table(res);
        console.log("Department view success\n");

        promptDepartment(departmentChoices);
    });

}

const promptDepartment = (departmentChoices) => {
    inquirer
    .prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Please select a department",
            choices: departmentChoices
        }

    ])
    .then((answer) => {
        console.log("answer ", answer.departmentId);

        var query = 
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
        FROM employee e
        JOIN role r
        ON e.role_id = r.id
        JOIN department d
        ON d.id = r.department_id
        WHERE d.id = ?`

        connection.query(query, answer.departmentId, (err, res) => {
            if (err) throw err;

            console.table("response", res);
            console.log(res.affectedRows + "Employees viewed\n");

            question();
        });
    });
}
