//All requires
var mysql = require("mysql");
var inquirer = require("inquirer");

//Set up connection
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Bootcamp2020",
    database: "employee_DB"
});

//Prompt first question when connected
connection.connect(function(err) {
    if (err) throw err;
    askFirstQuestion();
});

//First Question to decide between inital actions
function askFirstQuestion() {
    inquirer
        .prompt([{
            name: "firstQuestion",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "Add Role",
                "Add Employee",
                "View Departments",
                "View Roles",
                "View Employees",
                "Update Employee Role",
                "exit"
            ]
        }, {
            name: "departmentName",
            type: "input",
            message: "What is the name of the department you'd like to add?",
            when: function(answer) {
                return !!answer.firstQuestion && (answer.firstQuestion === "Add Department")
            }
        }, {
            name: "roleTitle",
            type: "input",
            message: "What is the title of the role you'd like to add?",
            when: function(answer) {
                return !!answer.firstQuestion && (answer.firstQuestion === "Add Role")
            }
        }, {
            name: "roleSalary",
            type: "input",
            message: "What is the salary of the role you'd like to add?",
            when: function(answer) {
                return !!answer.firstQuestion && (answer.firstQuestion === "Add Role")
            }
        }, {
            name: "roleDepartmentID",
            type: "input",
            message: "What is the department ID of the role you'd like to add?",
            when: function(answer) {
                return !!answer.firstQuestion && (answer.firstQuestion === "Add Role")
            }
        }, {
            name: "firstName",
            type: "input",
            message: "What is the first name of the employee you'd like to add?",
            when: function(answer) {
                return !!answer.firstQuestion && (answer.firstQuestion === "Add Employee")
            }
        }, {
            name: "lastName",
            type: "input",
            message: "What is the last name of the employee you'd like to add?",
            when: function(answer) {
                return !!answer.firstQuestion && (answer.firstQuestion === "Add Employee")
            }
        }, {
            name: "employeeRoleID",
            type: "input",
            message: "What is the role ID of the employee you'd like to add?",
            when: function(answer) {
                return !!answer.firstQuestion && (answer.firstQuestion === "Add Employee")
            }
        }, {
            name: "employeeManagerID",
            type: "input",
            message: "What is the manager ID of the employee you'd like to add?",
            when: function(answer) {
                return !!answer.firstQuestion && (answer.firstQuestion === "Add Employee")
            }
        }, {
            name: "updateEmployeeID",
            type: "input",
            message: "What is the employee ID of the employee you'd like to update?",
            when: function(answer) {
                return !!answer.firstQuestion && (answer.firstQuestion === "Update Employee Role")
            }
        }, {
            name: "updateEmployeeRole",
            type: "input",
            message: "What is the new role ID of the employee",
            when: function(answer) {
                return !!answer.firstQuestion && (answer.firstQuestion === "Update Employee Role")
            }
        }])
        .then(function(answer) {
            switch (answer.firstQuestion) {
                case "Add Department":
                    addOptions("department", answer);
                    break;
                case "Add Role":
                    addOptions("role", answer);
                    break;
                case "Add Employee":
                    addOptions("employee", answer);
                    break;
                case "View Departments":
                    viewOptions("department");
                    break;
                case "View Roles":
                    viewOptions("role");
                    break;
                case "View Employees":
                    viewOptions("employee");
                    break;
                case "Update Employee Role":
                    updateEmployeeRole(answer);
                    break;
                case "exit":
                    connection.end();
                    break;
            }
        });
}

//Function for if they want to view a department, role or employee
function viewOptions(viewAnswer) {
    const viewType = "SELECT * FROM " + viewAnswer;
    connection.query(viewType, function(err, res) {
        if (err) throw err;
        if (viewAnswer === "department") {
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].id + " || Name: " + res[i].name);
            }
        } else if (viewAnswer === "role") {
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].id + " || Title: " + res[i].title + " || Salary: " + res[i].salary + " || Department ID: " + res[i].department_id);
            }
        } else {
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].id + " || Name: " + res[i].first_name + " " + res[i].last_name + " || Role ID: " + res[i].role_id + " || Manager ID: " + res[i].manager_id);
            }
        }
        askFirstQuestion();
    });
}

//Function for if they want to add a department, role or employee
function addOptions(addAnswer, answer) {
    //Variable for parameters needs to switch based on table
    if (addAnswer === "department") {
        var tableAnswers = { name: answer.departmentName };
    } else if (addAnswer === "role") {
        var tableAnswers = { title: answer.roleTitle, salary: answer.roleSalary, department_id: answer.roleDepartmentID }
    } else {
        var tableAnswers = { first_name: answer.firstName, last_name: answer.lastName, role_id: answer.employeeRoleID, manager_id: answer.employeeManagerID }
    }
    // Variable for what we're inserting depends on previous answer
    const addType = "INSERT INTO " + addAnswer + " SET ?";
    //Use variablwes to make connection 
    connection.query(addType, tableAnswers, function(err, res) {
        if (err) throw err;
        if (addAnswer === "department") {
            console.log(res.affectedRows + " " + addAnswer + " added! \n");
        } else if (addAnswer === "role") {
            console.log(res.affectedRows + " " + addAnswer + "added! \n");
        } else {
            console.log(res.affectedRows + " " + addAnswer + "added! \n");
        }
        askFirstQuestion();
    });
}

function updateEmployeeRole(answer) {
    console.log("Updating the employee's role...\n");
    var query = connection.query(
        "UPDATE employee SET ? WHERE ?", [{
                role_id: answer.updateEmployeeRole
            },
            {
                id: answer.updateEmployeeID
            }
        ],
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " songs updated!\n");
            // Call deleteSongs AFTER the UPDATE completes
        }
    );
    //Show that the change has been made
    viewOptions("employee");
    // logs the actual query being run
    console.log(query.sql);
    askFirstQuestion();
}

// function runSearch() {
//     inquirer
//         .prompt({
//             name: "action",
//             type: "list",
//             message: "What would you like to do?",
//             choices: [
//                 "Find songs by artist",
//                 "Find all artists who appear more than once",
//                 "Find data within a specific range",
//                 "Search for a specific song",
//                 "exit"
//             ]
//         })
//         .then(function(answer) {
//             switch (answer.action) {
//                 case "Find songs by artist":
//                     artistSearch();
//                     break;

//                 case "Find all artists who appear more than once":
//                     multiSearch();
//                     break;

//                 case "Find data within a specific range":
//                     rangeSearch();
//                     break;

//                 case "Search for a specific song":
//                     songSearch();
//                     break;

//                 case "exit":
//                     connection.end();
//                     break;
//             }
//         });
// }

// function artistSearch() {
//     inquirer
//         .prompt({
//             name: "artist",
//             type: "input",
//             message: "What artist would you like to search for?"
//         })
//         .then(function(answer) {
//             var query = "SELECT position, song, year FROM top5000 WHERE ?";
//             connection.query(query, { artist: answer.artist }, function(err, res) {
//                 if (err) throw err;
//                 for (var i = 0; i < res.length; i++) {
//                     console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
//                 }
//                 runSearch();
//             });
//         });
// }

// function multiSearch() {
//     var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
//     connection.query(query, function(err, res) {
//         if (err) throw err;
//         for (var i = 0; i < res.length; i++) {
//             console.log(res[i].artist);
//         }
//         runSearch();
//     });
// }

// function rangeSearch() {
//     inquirer
//         .prompt([{
//                 name: "start",
//                 type: "input",
//                 message: "Enter starting position: ",
//                 validate: function(value) {
//                     if (isNaN(value) === false) {
//                         return true;
//                     }
//                     return false;
//                 }
//             },
//             {
//                 name: "end",
//                 type: "input",
//                 message: "Enter ending position: ",
//                 validate: function(value) {
//                     if (isNaN(value) === false) {
//                         return true;
//                     }
//                     return false;
//                 }
//             }
//         ])
//         .then(function(answer) {
//             var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//             connection.query(query, [answer.start, answer.end], function(err, res) {
//                 if (err) throw err;
//                 for (var i = 0; i < res.length; i++) {
//                     console.log(
//                         "Position: " +
//                         res[i].position +
//                         " || Song: " +
//                         res[i].song +
//                         " || Artist: " +
//                         res[i].artist +
//                         " || Year: " +
//                         res[i].year
//                     );
//                 }
//                 runSearch();
//             });
//         });
// }

// function songSearch() {
//     inquirer
//         .prompt({
//             name: "song",
//             type: "input",
//             message: "What song would you like to look for?"
//         })
//         .then(function(answer) {
//             console.log(answer.song);
//             connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//                 if (err) throw err;
//                 console.log(
//                     "Position: " +
//                     res[0].position +
//                     " || Song: " +
//                     res[0].song +
//                     " || Artist: " +
//                     res[0].artist +
//                     " || Year: " +
//                     res[0].year
//                 );
//                 runSearch();
//             });
//         });
// }