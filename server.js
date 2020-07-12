var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "ruokaddy?",
    database: "employeeTracker_DB"
});

const menuOptions = {
    "Add Department": function(){
        console.log("Add Department")
        mainMenu()
    },
    "Add Employee Role": function(){
        console.log("Add Employee Role")
        mainMenu()
    },
    "Add New Employee": function(){
        inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the first name?",
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the last name",
            },            {
                type: "input",
                name: "role_id",
                message: "What is the role id?",
            },            {
                type: "input",
                name: "manager_id",
                message: "What is the manager id?",
            },
        ]).then(function (answer) {
            addEmployee(answer.first_name, answer.last_name, parseInt(answer.role_id), parseInt(answer.manager_id), mainMenu)
            // console.log(answers)
        })
    
        // console.log("Add New Employee")
        // mainMenu()
    },
    "View Departments": function(){
        // console.table([
            console.log("View Departments"),
            selectAllFrom("departments", mainMenu)
        // ])
    },
    "View Employee Roles": function(){
        console.log("View Employee Roles")
        selectAllFrom("roles", mainMenu)
    },
    "View Employees": function(){
        // console.table("All Employees")
        console.log("View Employees")
        selectAllEmployees(mainMenu)
    },
    "Update Employee Roles": function(){
        console.log("Update Employee Roles")
        mainMenu()
    },
}

function mainMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "menuSelection",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "Add Employee Role",
                "Add New Employee",
                "View Departments",
                "View Employee Roles",
                "View Employees",
                "Update Employee Roles",
            ]
        },
    ]).then(function (answers) {
        menuOptions[answers.menuSelection]()
        // console.log(answers)
    })
}


/////////////////////////////////

function selectAllEmployees(cb) {
    // console.table([

        connection.query("SELECT e.first_name, e.last_name, m.first_name as mgr_first_name, m.last_name as mgr_last_name FROM employee e LEFT JOIN employee m ON e.manager_id = m.id",
            function (error, results, fields) {
            if (error) throw error;
            // console.log(results[0].first_name)
            let employees = []
            results.forEach(function (model){
                employees.push({first_name : model.first_name,
                    last_name : model.last_name,
                    mgr_first_name : model.mgr_first_name,
                    mgr_last_name : model.mgr_last_name
            
                })
            })
            // employees.push(results[0].first_name)
            // employees.push(results[1].first_name)
            console.table(employees)
            cb()
            //   console.log(fields)
        })
    // ])
}

function selectAllFrom(tableName, cb) {
    console.table([

        connection.query("SELECT * FROM " + tableName, function (error, results, fields) {
            if (error) throw error;
            console.log(results)
            cb()
            //   console.log(fields)
        })
    ])
}

function addEmployee(first_name, last_name, role_id, manager_id, cb) {
    var sqlQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
    connection.query(sqlQuery, [first_name, last_name, role_id, manager_id], function (error, results, fields) {
        if (error) throw error;
        console.log(results)
        cb()
        //   console.log(fields)
    });

}

function addDepartment(name) {
    var sqlQuery = `INSERT INTO department (name) VALUES (?)`
    connection.query(sqlQuery, [name], function (error, results, fields) {
        if (error) throw error;
        console.log(results)
        //   console.log(fields)
    });
}

function addRole(title, salary, department_id) {
    var sqlQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
    connection.query(sqlQuery, [title, salary, department_id], function (error, results, fields) {
        if (error) throw error;
        console.log(results)
        //   console.log(fields)
    });
}

function updateRole(role_id, employeeID) {
    connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [role_id, employeeID], function (error, results, fields) {
        if (error) throw error;
        // ...
    });
}
// addEmployee("Bob","Smith", 1, 2)
// addRole("pope", 120.00, 3)
// addDepartment("church")
// updateRole(3, 2)
// selectAllFrom("employee")
// selectAllFrom("role")
// selectAllFrom("department")
mainMenu()
