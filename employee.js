var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Bootcamp2020",
    database: "top_songsDB"
});

connection.connect(function(err) {
    if (err) throw err;
    askFirstQuestion();
});

function askFirstQuestion() {
    inquirer
        .prompt({
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
        })
        .then(function(answer) {
            switch (answer.action) {
                // case "Add Department":
                //     addDepartment();
                //     break;
                // case "Add Role":
                //     addRole();
                //     break;
                // case "Add Employee":
                //     addEmployee();
                //     break;
                case "View Departments":
                    viewOptions("department");
                    break;
                case "View Roles":
                    viewOptions("role");
                    break;
                case "View Employees":
                    viewOptions("employee");
                    break;
                    // case "Update Employee Role":
                    //     updateEmployeeRole();
                    //     break;
                case "exit":
                    connection.end();
                    break;
            }
        });
}

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
                console.log("ID: " + res[i].id + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + " || Role ID: " + res[i].role + " || Manager ID: " + res[i].manager_id);
            }
        }
        askFirstQuestion();
    });

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