// 1 -- display all items : id, name, and price
// 2 -- then prompt the user with 2 messages:
// 		--> ask the id of the product they would like to buy
// 		--> then ask how many units they would like to buy
// 3 -- then check to see if we have the available product
// 		--> if not then show message and do not do any transaction
// 		--> otherwise fullfill the order
// 				--> update sql database to reflect the remaining quantity
// 				--> show the customer the total cost of their purchase (.. a receipt)


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

function userUpdateDb(data, amount) { 
    var uItem = data[0].item_id;
    var uStock = data[0].stock_quantity;
    var newAmount = uStock - amount;

    query = "UPDATE products SET stock_quantity = " + newAmount + ", product_sales = product_sales + (" + amount + " * price) WHERE item_id = " + uItem;
    connection.query(query, function(err, res) {});
    
        var query = "SELECT * FROM products where item_id = " + uItem;
    connection.query(query, function(err, res) {
        console.log("Thank you for your purchase!!");
        console.log("Item ==> " + res[0].product_name);
        console.log("Number of items ==> " + amount);
        console.log("Total Cost ==> $ " + (amount * res[0].price).toFixed(2) + "  ( @ " + res[0].price + " each )");
    });
    connection.end();    
};


function userProd(answers) {
    var query = "SELECT * FROM products where item_id = " + parseInt(answers.userProduct);

    connection.query(query, function(err, res) {
        console.log("");
        if (res == "") {
            console.log("Sorry we currently dont carry that item...check again later.");
        } else {
            var uProd = res[0].product_name;
            var uStock = res[0].stock_quantity;

            if (answers.userAmount > uStock) {
                console.log("Sorry, we dont have that many right now..try again later.");
            } else {
                userUpdateDb(res, answers.userAmount);
            };
        };
    });
};

function userBuy() {
    inquirer.prompt([{
            type: "input",
            name: "userProduct",
            message: "Which product would you like? ..choose by product id: "
        }, {
            type: "input",
            name: "userAmount",
            message: "How many would you like ?"
        }

    ]).then(function(answers) {
        userProd(answers);

    });
};

function showAll(callback) {
    connection.connect(function(err) {
        if (err) throw err;
        connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
            console.log("Current Products");
            console.table(res);
        });
    });
    var timer = setTimeout(function() { callback(); }, 1000);
};

showAll(userBuy);