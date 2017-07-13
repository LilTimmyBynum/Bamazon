// List a set of menu options
//		- View Product Sales by Department
//		   	--display department_id, department_name, over_head_costs, product_sales, total_profit
//		- Create new Department

var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'Diddybop!29!',
    database: 'bamazon'
});

function viewSales() {
    connection.connect(function(err) {
        if (err) throw err;

        var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, sum(products.product_sales) as product_sales, (sum(products.product_sales) - departments.over_head_costs) as total_profit FROM departments INNER JOIN products ON departments.department_name = products.department_name group by department_name";

        connection.query(query, function(err, res) {
            console.log("Products for Sale");
            console.table(res);
        });
        connection.end();
    });
};

function createDepartment() {
    inquirer.prompt([{
            type: "input",
            name: "deptName",
            message: "Enter new deparment name: "
        }, {
            type: "input",
            name: "overHead",
            message: "Enter department overhead cost: "
        }

    ]).then(function(answers) {
        var query = "INSERT INTO departments (department_name, over_head_costs) VALUES ('" + answers.deptName + "', " + answers.overHead + ")";
        connection.query(query, function(err, res) {
            console.log("Your new department has been created.");
        });
        connection.end();
    });
};

function supervisorMenu() {
    inquirer.prompt({
            type: "list",
            name: "userSupervisor",
            message: "Choose a menu option: ",
            choices: [
                "View Product Sales by Department",
                "Create New Department"
            ]
        }

    ).then(function(answers) {
        switch (answers.userSupervisor) {
            case "View Product Sales by Department":
                viewSales();
                break;

            case "Create New Department":
                createDepartment();
                break;
        }
    });
};

supervisorMenu();
