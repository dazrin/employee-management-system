// Dependancies
const mysql = require('mysql');
const inquirer = require('inquirer');

// Create server + PORT
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'kingDDom.',
  database: 'employeeManagement_DB',
});

// Establish connection
connection.connect((err) => {
    if (err) throw err;
    start();
});

// Prompt user function
const start = () => {

    console.log(`
    ____ ____ ____ ____ ____ ____ ____ ____ _________ ____ ____ ____ ____ ____ ____ ____ 
    ||E |||m |||p |||l |||o |||y |||e |||e |||       |||T |||r |||a |||c |||k |||e |||r ||
    ||__|||__|||__|||__|||__|||__|||__|||__|||_______|||__|||__|||__|||__|||__|||__|||__||
    |/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/_______\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|
    `);

    inquirer
      .prompt({
        name: 'option',
        type: 'list',
        message: 'Please select an option:',
        choices: [
            "View All Employees",
            "View All Employees By Department",
            "View All Employees By Manager",
            "Add Employee",
            "Remove Employee",
            "Update Employee's Role",
            "Update Employee's Manager",
            "View Budget of Department",
            "View All Roles",
            "Add Role",
            "Remove Role",
            "View All Departments",
            "Add Department",
            "Remove Department",
            "Exit"
        ]
    })
    .then((result) => {
        switch (result.option) {
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View All Employees By Department":
                viewAllEmployeesByDepartment();
                break;
            case "View All Employees By Manager":
                viewAllEmployeesByManager();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee's Role":
                updateEmployeeRole();
                break;
            case "Update Employee's Manager":
                updateEmployeeManager();
                break;
            case "View Budget of Department":
                viewDepartmentBudget();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Departments":
                viewAllDepartments();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "Remove Department":
                removeDepartment();
                break;
            case "Exit":
                console.log("Goodbye!");
                connection.end();
                break;
        }
    });
};

// View all employees
const viewAllEmployees = () => {

    // SQL query to get all employees in the database and order them by ID
    const getAllEmployeesByID = `
    SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name as department, CONCAT(m.first_name," ", m.last_name) as manager
    FROM employee e
    LEFT JOIN employee m  
        ON m.id = e.manager_id
    INNER JOIN role 
        ON role.id = e.role_id
    INNER JOIN department
        ON department.id = role.department_id
    ORDER BY e.id;`;

    // Send query to view all employees 
    connection.query(getAllEmployeesByID, (err, res) => {

        // Catch errors
        if(err) throw err;

        // Print the ordered list of employees from the database and organize them in a table
        console.table(res);

        // Send the user back to the main menu
        start();
    });
}

// View all roles
const viewAllRoles = () => {

    // SQL query to get all roles from the database
    const getAllRoles = `
    SELECT * FROM role;
    `;

    // Send query to get all roles from the database
    connection.query(getAllRoles, (err, res) => {

        // Catch errors
        if(err) throw err;

        // Get each role's title field from the query's response and store them in a variable called 'roles'
        let roles = res.map(role => {
            return {"Roles": role.title};
        });

        // Display the titles of every role to the user in an organized table
        console.table(roles);

        // Send the user back to the main menu
        start();
    });
}

// View all departments
const viewAllDepartments = () => {

    // SQL query to get all departments in the database 
    const getAllDepartments = `
    SELECT * FROM department;
    `;

    // Send query to get all departments to the database
    connection.query(getAllDepartments, (err, res) => {

        // Catch errors
        if(err) throw err;

        // Get each department's name field and store them in a variable called 'departments'
        let departments = res.map(department => {
            return {"Departments": department.name};
        });

        // Display the names of each department in the database to the user in an organized table
        console.table(departments);

        // Send the user back to the main menu
        start();
    });
}

// View all employees from a specific department
const viewAllEmployeesByDepartment = () => {

    // SQL query to get all departments in the database
    const getAllDepartments = `
    SELECT * FROM department;
    `;

    // Send query to the database to get all departments in the database
    connection.query(getAllDepartments, (err, res) => {

        // Catch errors
        if(err) throw err;

        // Get each department's name field and store them in a variable named 'departments'
        let departments = res.map(department => department.name);

        // Prompt user to select a department
        inquirer
        .prompt([
            {
                type: "list",
                message: "Please select a department to view their employees",
                choices: departments,
                name: "department"
            }
        ])
        .then((response) =>{

            // SQL query to get all employees of a specific department in the database and order them by ID
            const getAllEmployeesByDepartmentById = `
            SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name as department, CONCAT(m.first_name," ", m.last_name) as manager
            FROM employee e
            LEFT JOIN employee m  
                ON m.id = e.manager_id
            INNER JOIN role 
                ON role.id = e.role_id
            INNER JOIN department
                ON department.id = role.department_id 
            WHERE department.name = ?
            ORDER BY e.id;
            `;

            // Send query to database to get all the employees of a specific department
            connection.query(getAllEmployeesByDepartmentById, [response.department], (err, res) => {

                // Catch errors
                if(err) throw err;

                // Display all the employees of a specific department (the query's response) to the user in an organized table
                console.table(res);

                // Send the user back to the main menu
                start();
            });
        });
    });
}

// View all employees of a specific manager

const viewAllEmployeesByManager = () => {

    // SQL query to get all managers in the database and set their first and last name fields as a variable called 'manager' (important for later)
    const getAllManagers = `
    SELECT m.id, CONCAT(m.first_name," ", m.last_name) as manager 
    FROM employee e
    INNER JOIN employee m
    ON m.id = e.manager_id;
    `;

    // Send query to get all managers in the database
    connection.query(getAllManagers, (err, res) => {

        // Catch errors
        if(err) throw err;

        // Instantiate an empty object to fill with manager data
        let managersObj = {};

        // Get the response of the query;
        // For each manager, get the variable 'manager' which is storing each manager's first and last name fields (done in the SQL query)
        res.forEach(managers => {

            // Set the manager field (containing the first and last name of each manager) as the id of the managers object
            managersObj[managers.manager] = managers.id; 
        });

        // Prompt user to select a manager from the queried list to view their respective employees
        inquirer
        .prompt([
            {
                type: "list",
                message: "Please select a manager to view their employees",
                choices: Object.keys(managersObj),
                name: "manager"
            }
        ])
        .then((response) => {

            // SQL query to get all employees belonging to a specific manager ordered by ID
            const getAllEmployeesByManagerByID = `
            SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name as department, CONCAT(m.first_name," ", m.last_name) as manager
            FROM employee e
            LEFT JOIN employee m  
                ON m.id = e.manager_id
            INNER JOIN role 
                ON role.id = e.role_id
            INNER JOIN department
                ON department.id = role.department_id 
            WHERE m.id = ?
            ORDER BY e.id;
            `;

            // Send query to database; gets the manager selected by the user and displays all employees belonging to that manager
            connection.query(getAllEmployeesByManagerByID, [managersObj[response.manager]], (err, res) => {

                // Catch errors
                if(err) throw err;

                // Display query results in an organized table
                console.table(res);

                // Send the user back to the main menu
                start();
            });
        });
    });
}

// Add employee
const addEmployee = () => {

    // SQL query to get all roles 
    const getAllRolesQuery = `
    SELECT * FROM role;
    `;

    // Get all roles; store each role in an object and make its title field the id of the element
    connection.query(getAllRolesQuery, (err, res) => {
        if(err) throw err;
        let rolesObj = {};
        res.forEach(employee => {
            rolesObj[employee.title] = employee.id;
        });
    
        // SQL query to get all employees
        const getAllEmployeesQuery = `
        SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name as department, CONCAT(m.first_name," ", m.last_name) as manager
        FROM employee e
        LEFT JOIN employee m  
            ON m.id = e.manager_id
        INNER JOIN role 
            ON role.id = e.role_id
        INNER JOIN department
            ON department.id = role.department_id;
        `;

        // Get all employees in database; declare employee object to store response data
        connection.query(getAllEmployeesQuery, (err, res) => {
            if(err) throw err;
            let employeeObj = {
                "none": null
            };

            // For each response element, concatenate each first_name and last_name fields in a variable called name
            // Assign the name as the element's id 
            res.forEach(element => {
                let name = [element.first_name, element.last_name].join(" ");
                employeeObj[name] = element.id;
            });

            // Ask for user input to fill each field in the employee object to be added 
            inquirer
            .prompt([
                {
                    type: "input",
                    message: "What is the employee's first name?",
                    name: "first_name"
                },
                {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "last_name"
                },
                {
                    type: "list",
                    message: "What is the employee's role?",
                    choices: Object.keys(rolesObj),
                    name: "role"
                },
                {
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: Object.keys(employeeObj),
                    name: "manager"
                }
            ])
            // Take the response object and send the query to add the response object to the database
            .then((response) => {

                // SQL query to add the employee with the fields the user inputted
                const addEmployeeQuery = `
                INSERT INTO employee SET ?
                `
                
                // Send query to database; set the response data to its corresponding field in the object
                connection.query(addEmployeeQuery, 
                    [
                        {
                            first_name: response.first_name,
                            last_name: response.last_name,
                            role_id: rolesObj[response.role],
                            manager_id: employeeObj[response.manager]
                        }
                    ],
                    (err, res) => {
                        if(err) throw err;

                        // Inform user that employee was successfully added to the database
                        console.log(`Added ${response.first_name} ${response.last_name} successfully`)
                        start();
                    });
                });
        })
    });
}

// Remove employee
const removeEmployee = () => {

    // Stored SQL query to get all employees in the database and order them by ID
    const getAllEmployeesByID = `
    SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name as department, CONCAT(m.first_name," ", m.last_name) as manager
    FROM employee e
    LEFT JOIN employee m  
        ON m.id = e.manager_id
    INNER JOIN role 
        ON role.id = e.role_id
    INNER JOIN department
        ON department.id = role.department_id
    ORDER BY e.id;`
    ;

    // Query database
    connection.query(getAllEmployeesByID, (err, res) => {
        if(err) throw err;
        let employeeObj = {
            "Quit": 1
        };

        // Concatenate each employee's first_name and last_name field and store it in a variable called name
        // Assign name field to be the id of the element (employee)
        res.forEach(element => {
            let name = [element.first_name, element.last_name].join(" ");
            employeeObj[name] = element.id;
        });
        
        // Ask for user input to select an employee to remove
        inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee would you like to remove?",
                choices: Object.keys(employeeObj),
                name: "employee"
            }
        ])
        .then((response) => {
            // SQL query to remove an an employee object from the database
            const removeEmployeeQuery = `
            DELETE FROM employee WHERE ?;
            `;

            // If user selects Quit, go back to main prompt; otherwise, send removeEmployeeQuery to the database
            if(response.employee === "Quit") start();
            else {

                // Pass in removeEmployeeQuery to remove the name id of the employee that the user selected
                connection.query(removeEmployeeQuery,[{ id: employeeObj[response.employee] }],(err, res) => {
                    if(err) throw err;

                    // Inform user that the deletion was performed successfully
                    console.log(`Removed ${response.employee} successfully`);

                    // Go back to main menu
                    start();
                });
            }
        });
    });
}

// Update employee role
const updateEmployeeRole = () => {

    // Store SQL query to get all employees in the database and order them by ID
    const getAllEmployeesByID = `
    SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name as department, CONCAT(m.first_name," ", m.last_name) as manager
    FROM employee e
    LEFT JOIN employee m  
        ON m.id = e.manager_id
    INNER JOIN role 
        ON role.id = e.role_id
    INNER JOIN department
        ON department.id = role.department_id
    ORDER BY e.id;`
    ;

    // Send query to database
    connection.query(getAllEmployeesByID, (err, res) => {
        if(err) throw err;
        let employeeObj = {};
        
        // Concatenate each employee's first_name and last_name field and store it in a variable called name
        // Assign name field to be the id of the employee object
        res.forEach(employee => {
            let name = [employee.firstName, employee.last_name].join(" ");
            employeeObj[name] = employee.id;
        });

        // SQL query to get all roles in database
        const getAllRolesQuery = `
        SELECT * FROM role;
        `;

        // Send query to database to get all roles
        connection.query(getAllRolesQuery, (err, res) => {
            if (err) throw err;
            let rolesObj = {};

            // Assign each role's title field to be the id of the role object
            res.forEach(roles => {
                rolesObj[roles.title] = roles.id;
            });
        

        // Prompt user to select an employee's role to update
        inquirer
        .prompt([
            {
                type: "list",
                message: "Who's role would you wish to update?",
                choices: Object.keys(employeeObj),
                name: "employee"
            },
            {
                type: "list",
                message: "what is their new role?",
                choices: Object.keys(rolesObj),
                name: "role"
            }
        ])
        .then((response) => {
            // SQL query to update an employee's role
            const updateEmployeeQuery = `UPDATE employee SET role_id = ? WHERE id = ?`;

            // Send query to update employee
            connection.query(updateEmployeeQuery,[rolesObj[response.role], employeeObj[response.employee]], (err, res) => {
                if (err) throw err;
                console.log(`Updated ${response.employee}'s role successfully`);
                start();
            });
        });
      });
    });
}

// Update employee manager
const updateEmployeeManager = () => {

    // SQL Query to get all employee's and order them by ID
    const getAllEmployeesByID = `
    SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name as department, CONCAT(m.first_name," ", m.last_name) as manager
    FROM employee e
    LEFT JOIN employee m  
        ON m.id = e.manager_id
    INNER JOIN role 
        ON role.id = e.role_id
    INNER JOIN department
        ON department.id = role.department_id
    ORDER BY e.id;`
    ;

    // Send query to database 
    connection.query(getAllEmployeesByID, (err, res) => {

        // Catch errors
        if(err) throw err;

        // Empty object to store employee data
        let employeeObj = {};

        // Concatenate each employee's first and last name fields into one variable called 'name'
        // Assign each employee's 'name' as the id of the object
        res.forEach(employee => {
            let name = [employee.first_name, employee.last_name].join(" ");
            employeeObj[name] = employee.id;
        });

        // Prompt user to select an employee to update their manager
        inquirer
        .prompt([
            
            // Displays a list of all the employees in the database
            {
                type: "list",
                message: "Select an employee's manager to update: ",
                choices: Object.keys(employeeObj),
                name: "employee"
            }
        ])
        .then((response) => {

        // Store the response data in variables;

        // Id is the employee the user selected within the employee object
        let id = employeeObj[response.employee];

        // Name is the selected employee
        let name = response.employee;

        // Remove selected employee from the employee object
        delete employeeObj[response.employee]
        employeeObj["None"] = null;
        
        // Prompt user to select an employee to assign them as the manager of the selected employee
        inquirer
        .prompt([
            {
            // Displays a list of employees
                type: "list",
                message: "Select an employee to assign them as the manager of this employee",
                choices: Object.keys(employeeObj),
                name: "manager"
            }
        ])
        .then((response) => {

            // SQL query to update an employee as a manager
            const updateManagerQuery = `UPDATE employee SET ? WHERE ?`;

            // Query database
            connection.query(updateManagerQuery,
                [
                    // Assign manager_id to the selected employee
                    {manager_id: employeeObj[response.manager]},
                    {id: id}
                ],
                (err, res) => {

                    // Catch errors 
                    if (err) throw err;

                    // Print to the user that the employee's manager was updated successfully
                    console.log(`${name}'s manager was successfully updated.`);

                    // Send the user back to the main menu
                    start();
                });
            });
        });    
    });
}

// Add role
const addRole = () => {

// SQL query to get all departments from the database
    const getAllDepartments = `
    SELECT * FROM department;
    `;

// SQL query to get all roles from the database
    const getAllRoles = `
    SELECT * FROM role;
    `;

// Send query to database
    connection.query(getAllDepartments, (err, res) => {

    // Catch errors
        if (err) throw err;

    // Declare empty object to populate with department query data
        let departmentObj = {};

    // Populate department object with data 
        res.forEach(department => {
            departmentObj[department.name] = department.id;
        });

        connection.query(getAllRoles, (err, res) => {

        // Catch errors
            if (err) throw err;

        // Using the response of the query, store the title of each role into a variable
            let roles = res.map(role => role.title.toLowerCase());

        // Prompt the user to enter the information required to create a role 
            inquirer
            .prompt([
                {
            // Ask user to create name of role
                type: 'input',
                message: 'Please enter the name of the role you will be creating: ',
                name: "role",

            // Validation to ensure that the role the user is creating is not a duplicate of a role that already exists in the database
                validate: value => {
                    if(roles.includes(value.toLowerCase())) return "There is another role that already exists in the database with the same name. Please enter a different role name: ";
                    else return true;
                }
                },
                {
            // Ask user to enter a number for the salary of the role being created
                type: "input",
                message: "Please enter a salary for this role: ",
                name: "salary",

            // Validation to ensure that the salary field being entered is a valid number
                validate: value => {
                    if(isNaN(value)) return "Value was not a number. Please enter a valid input for the role Salary";
                    else return true;
                }
            },
            {
            // Ask the user what department to categorize the role created under
                type: "list",
                message: "Which department does this role fall under?",
                name: "department",

            // Show list of departments by passing the department Obj
                choices: Object.keys(departmentObj)
            }
        ])
        .then
        ((response) => {

        // SQL query to add a new role to the database
            const addRoleQuery = `
            INSERT INTO role SET ?
            `;

        // Send query to datbase; Add new role object to database
            connection.query(addRoleQuery,
                [   
                // New role object built from response to add
                    {
                        title: response.role,
                        salary: response.salary,
                        department_id: departmentObj[response.department]
                    }
                ],

            // Callback function; Print to console that role was successfully added to the database
                (err, res) => {

                    // Catch errors
                    if (err) throw err;

                    // Print to the user that the role was successfully added to the database
                    console.log(`Added ${response.role} to the database successfully`);

                 // Send user back to main menu
                    start();
                });
            });
        });
    });
}

// Add department
const addDepartment = () => {

    // SQL query to get all departments
    const getAllDepartments = `
    SELECT * FROM department;
    `;

    // Send query 
    connection.query(getAllDepartments, (err, res) => {
        if (err) throw err;
        let departments = res.map(element => element.name.toLowerCase());
        
        inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter the name of the department you would like to add to the database: ",
                name: "department",
                validate: value => {
                    if(departments.includes(value.toLowerCase())) return "There is already a department in the database with the same name. Please enter a different name for the department you would like to add: ";
                    else return true;
                }
            }
        ])
        .then((response) => {

            // SQL Query to add a new department
            const addDepartment = `
            INSERT INTO department SET ?
            `;

            // Send Query to add a new department to the database
            connection.query(addDepartment,
                [

                    // Department object built using the user's response
                    {
                        name: response.department
                    }
                ],

                // Callback function; Print to console that department was successfully added to the database
                (err, res) => {
                    if (err) throw err;
                    console.log(`Successfully added ${response.department} to the database`);
                    start();
                });
        });
    });
}

// View budget of department
const viewDepartmentBudget = () => {

    // SQL query to get all departments
    const getAllDepartments = `
    SELECT * FROM department;
    `;

    // Send query to database tp get all departments
    connection.query(getAllDepartments, (err, res) => {

        // Catch errors
        if (err) throw err;

        // Get the name field of every department in the response object and store it in a variable called departments
        let departments = res.map(department => department.name);

        // Prompt user to select a department's budget to view
        inquirer
        .prompt([
            {
                type: "list",
                message: "Which department's budget would you like to view?",
                name: "department",
                choices: departments
            }
        ])
        .then((response) => {

            //SQL query to view the budget of a department
            const viewDepartmentBudget = `
            SELECT SUM(role.salary) as budget
            FROM employee
            INNER JOIN role 
            ON role.id = employee.role_id
            INNER JOIN department
            ON department.id = role.department_id
            WHERE department.name = ?
            ;
            `;

            // Send query to view the total budget of the user's selected department (response)
            connection.query(viewDepartmentBudget,[response.department], (err, res) => {

                // Catch errors
                if (err) throw err;

                // Print the budget of the selected department to the user
                console.log(`The ${response.department} department's total budget is currently $ ${res[0].budget}.`)
                start();
            });
        });
    });
}

// Remove Role
const removeRole = () => {

    // SQL query to get all the roles from the database
    const getAllRoles = `
    SELECT * FROM role;
    `;

    // Send query to database to get all roles
    connection.query(getAllRoles, (err, res) => {

        // Catch errors
        if (err) throw err;

        // Declare 'empty' object to populate with roles data from response of query
        let rolesObj = {
            "Quit": 1
        };

        // For each role that was retreived from the query, set the title of each role as the id
        res.forEach(role => {
            rolesObj[role.title] = role.id;
        });

        // Prompt user to remove a role; Warn user that removing a role will remove any employees with that role 
        inquirer.prompt([
            {
                type: "list",
                message: "Which role would you like to remove? WARNING: ALL EMPLOYEES WITH THIS ROLE WILL ALSO BE REMOVED!",
                name: "role",

                // Display the populated list of roles to the user by passing the roles object containing the query response data
                choices: Object.keys(rolesObj)
            }
        ])
        .then((response) => {

            // SQL query to remove a selected employee from a certain place in the database
            const removeEmployeeQuery = `
            DELETE FROM employee WHERE ?;
            `;

            // If the user selected Quit, return the user to the main menu
            if(response.role === "Quit") start();
            else { 

                // Send query to database; pass in the role the user selected from the roles object 
                connection.query(removeEmployeeQuery, [{role_id: rolesObj[response.role]}], (err, res) => {

                    // SQL query to remove a selected role from the database
                    const removeRoleQuery = `
                    DELETE FROM role WHERE ?;
                    `;

                    // Catch errors
                    if (err) throw err;

                    // Send query to remove the selected role from the database
                    connection.query(removeRoleQuery, [{id: rolesObj[response.role]}], (err, res) => {

                        // Catch errors
                        if (err) throw err;

                        // Print to the user that the role was successfully removed
                        console.log(`Removed ${response.role} from the database successfully. Any employees with this role have also been removed`);

                        // Send user back to the main menu
                        start();
                    });
                });
            }
        });
    });


}

// Remove Department
const removeDepartment = () => {

    // SQL Query to get all departments
    const getAllDepartmentsQuery = `
    SELECT * FROM department;
    `;

    // Send query to the database
    connection.query(getAllDepartmentsQuery, (err, res) => {

        // Catch errors 
        if (err) throw err;

        // Declare empty object to populate with department query response data
        let departmentObj = {
            "Quit": 1
        }

        // Get the response and set each department's name field from the query to be it's id in the department object
        res.forEach(department => {
            departmentObj[department.name] = department.id
        });

        // Prompt user
        inquirer
        .prompt([
            {
                type: "list",
                message: "Please select a department to remove. WARNING: THIS WILL ALSO REMOVE ANY EMPLOYEES UNDER THAT DEPARTMENT!",
                name: "department",

                // Display the contents of the department object as the choices
                choices: Object.keys(departmentObj)
            }
        ])
        .then((response) => {

            // SQL query to get roles in the department
            const getRoleInDepartment = `
            SELECT role.id
            FROM role
            INNER JOIN department
                ON role.department_id = department.id
            WHERE department.id = ?
            ;`;

            // If the user selected quit, send them back to the main menu
            if (response.role === "Quit") start();
            else{
                connection.query(getRoleInDepartment, [departmentObj[response.department]], async (err, res) => {

                    // Catch errors
                    if (err) throw err;

                    // SQL query to remove a department
                    const removeDepartment = `DELETE FROM department WHERE ?;`

                    // Creates a list of roles using the query response data in a variable named 'role_ids'
                    let roles = res.map(role => role.id);

                    const promises = roles.map(async (roles) => {
                        await removeOneRole(roles);
                        return new Promise((resolve, reject) => {resolve()})
                    });

                    Promise.all(promises).then(() => {

                        connection.query(removeDepartment, [{name: response.department}], (err, res) => {

                            // Catch errors
                            if (err) throw err;

                            // Print to the user that the selected department was successfully removed
                            console.log(`${response.department} has been successfully removed from the database`);

                            // Send user back to the main menu
                            start();
                        });
                    });
                });
            }
        });
    });
}

// Function to remove one role from a specific employee; used in for loop
const removeOneRole = (id) => {

    // SQL query to remove an employee from a specific place
    const removeEmployee = `
    DELETE FROM employee WHERE ?;
    `;

    // SQL query to remove a role from a specific place
    const removeRole = `
    DELETE FROM role WHERE ?; 
    `;

    // Return a new Promise that sends a query to the database to remove an employee with a certain role from the database
    return new Promise((resolve, reject) => {
        connection.query(removeEmployee, [{ roles: id }], (err, res) => {

            // Catch errors
            if (err) throw err;

            // Send a query to the database to remove a role from a specific employee
            connection.query(removeRole, [{ id: id }], (err, res) => {

                // Catch errors
                if (err) throw err;

                // Finish promise
                resolve();
            });
        });
    });
}




