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
    password: "",
    database: "employeeTracker_DB"
});

const menuOptions = {
    "Add Department": function(){
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the department?"
            },
        ]).then(function (answer) {
            addDepartment(answer.name, mainMenu())
            // console.log(answers)
        })

        // console.log("Add New Employee")
        // mainMenu()
        // console.log("Add Employee Role")
        // mainMenu()
        // console.log("Add Department")
        // mainMenu()
    },

    "Add Employee Role": function(){
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What type of role would you like to add?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary (must include 2 decimal places)?"
            },
            {
                type: "input",
                name: "department_id",
                message: "What is the department id for this role?"
            },
        ]).then(function (answer) {
            addRole(answer.title, parseInt(answer.salary), parseInt(answer.department_id), mainMenu())
            // console.log(answers)
        })
    
        // console.log("Add New Employee")
        // mainMenu()
        // console.log("Add Employee Role")
        // mainMenu()
    },
    "Add New Employee": function(){
        inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employees first name?",
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the last employees name?",
            },            {
                type: "input",
                name: "role_id",
                message: "What is the employees role id?",
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
            selectAllDepartments(mainMenu)
        // ])
    },
    "View Employee Roles": function(){
        console.log("View Employee Roles")
        selectAllRoles(mainMenu)
    },
    "View Employees": function(){
        // console.table("All Employees")
        console.log("View Employees")
        selectAllEmployees(mainMenu)
    },
    "Update Employee Roles": function(){
        inquirer.prompt([
            {
                type: "input",
                name: "role_ID",
                message: "What role would you like to update?"
            },
            {
                type: "input",
                name: "employeeID",
                message: "What is the new employee ID?"
            },
        ]).then(function (answer) {
            updateRole(answer.role_ID, answer.employeeID, mainMenu())
            // console.log(answers)
        })

        // console.log("Add New Employee")
        // mainMenu()
        // console.log("Add Employee Role")
        // mainMenu()
        // console.log("Add Department")
        // mainMenu()
    },
    //     console.log("Update Employee Roles")
    //     mainMenu()
    // },
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

function selectAllRoles(cb){
    connection.query("SELECT r.id, r.title, r.salary, d.name FROM role r JOIN department d ON r.department_id = d.id",
    function (error, results, fields) {
        if (error) throw error;
        // console.log(results[0].first_name)
        let roles = []
        results.forEach(function (model){
            roles.push({id : model.id,
                role_title : model.title,
                role_salary : model.salary,
                department_name : model.name
        
            })
        })
        // employees.push(results[0].first_name)
        // employees.push(results[1].first_name)
        console.table(roles)
        cb()
        //   console.log(fields)
    })
}

function selectAllDepartments(cb){
    connection.query("SELECT * FROM department",
    function (error, results, fields) {
        if (error) throw error;
        // console.log(results[0].first_name)
        let departments = []

        results.forEach(function (model){
            departments.push({id : model.id,
                name : model.name
            })
        })
        // employees.push(results[0].first_name)
        // employees.push(results[1].first_name)
        console.table(departments)
        cb()
        //   console.log(fields)
    })
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
        if (error){
            console.log("Please use existing ID", error.sqlMessage)
        } else{
        console.log(results)}
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

function addRole(title, salary, department_id, cb) {
    var sqlQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
    connection.query(sqlQuery, [title, salary, department_id], function (error, results, fields) {
        if (error){
            console.log("Please use existing ID", error.sqlMessage)
        } else{
        console.log(results)}
        // cb()
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