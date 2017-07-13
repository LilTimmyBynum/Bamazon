// List a set of menu options
//      - View Product for Sale
//      - View Low Inventory
//      - Add to Inventory
//      - Add New Product

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

function viewProducts() {
    connection.connect(function(err) {
        if (err) throw err;
        connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
            console.log("Products for Sale");
            console.table(res);
        });
        connection.end();
    });
};

function viewLowInventory() {
    connection.connect(function(err) {
        if (err) throw err;
        connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
            console.log("Products for Sale");
            console.table(res);
        });
        connection.end();
    });
};

function addInventory() {
    inquirer.prompt([{
            type: "input",
            name: "itemChoice",
            message: "Which item would you like to add to (Choose by item_id) ?"
        }, {
            type: "input",
            name: "itemMore",
            message: "How many would you like to add ?"
        }

    ]).then(function(answers) {
        var query = "UPDATE products SET stock_quantity = (stock_quantity +" + answers.itemMore + ") WHERE item_id = " + answers.itemChoice;
        connection.query(query, function(err, res) {});
        connection.end();
        console.log("New quantity added to item inventory.");
    });
};

function newProduct() {
    inquirer.prompt([{
        type: "input",
        name: "prodName",
        message: "Enter item name: "
    }, {
        type: "input",
        name: "prodDepartment",
        message: "Enter item department: "
    }, {
        type: "input",
        name: "prodPrice",
        message: "Enter item price: "
    }, {
        type: "input",
        name: "prodQuantity",
        message: "Enter item quantity: "
    }]).then(function(answers) {

        var query = "INSERT INTO products(product_name, department_name, price, stock_quantity)";
        query += "VALUES('" + answers.prodName + "', '" + answers.prodDepartment + "', '" + answers.prodPrice + "', '" + answers.prodQuantity + "')";

        connection.query(query, function(err, res) {});
        connection.end();
        console.log("Your new product has been added to the inventory.");
    });
};

function managerMenu() {
    inquirer.prompt({
            type: "list",
            name: "userManager",
            message: "Choose a menu option: ",
            choices: [
                "View Product for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }

    ).then(function(answers) {
        switch (answers.userManager) {
            case "View Product for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                newProduct();
                break;
        }

    });
};

managerMenu();
