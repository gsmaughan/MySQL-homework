var mysql = require('mysql');
var inquirer = require("inquirer");
const isNumber = require('is-number');
const cTable = require('console.table');
var array = [];

var connection = mysql.createConnection({

	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Wolfpack83',
	database: 'bamazon'

});

connection.connect(function(err){
	if(err) throw err;
	// console.log('connected as id ' + connection.threadId);
	
	//call start function here
	start();
});

function start(){

	inquirer.prompt([
    	// Here we create a basic text prompt.
    	{
      		type: "list",
      		message: "What would you like to do?",
      		choices: ["View Products for sale", "View Low Inventory Items", "Add to Inventory", "Add New Product" ],
      		name: "what"
    	},
    	
    
  	]).then(function(user) {
  			if(user.what === "View Products for sale"){
          		view();
  			} //end if
  			else if(user.what == "View Low Inventory Items"){
  				low();
  			}
  			else if(user.what == "Add to Inventory"){
  				addQuery();
  			}
  			else{
  				//create an add new product function
  				createNewProduct();
  			}
 
  			
  	}); // end .then

}  //end start()

function view(){

	var query = connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", 

		function(err, res) {
    	if (err) throw err;

    	// console.log(res);

    	// -----------create a for loop to sift through the res array and display the id, name, prices, and quantity---
    	// res.forEach(function(items){
    	// 	console.log("\r\nItem ID: " + items.item_id + "\tProduct: " + items.product_name +
     //            "\tPrice: $" + items.price + "\tIn Stock: " + items.stock_quantity);
    	// });
      const table = cTable.getTable(res);
      console.log(table);

    	start();

  }); //end connection.query

} //end view()

function low(){

	var query = connection.query("SELECT * FROM products WHERE stock_quantity < 5", 
		function(err, res) {
    	if (err) throw err;

    	// for(var i = 0; i < res.length; i++){

    	// 	res.forEach(function(items){
    	// 	console.log("\r\nItem ID: " + items.item_id + "\tProduct: " + items.product_name +
     //            "\tPrice: $" + items.price + "\tIn Stock: " + items.stock_quantity);
    	// });
    	// }

      const table = cTable.getTable(res);
      console.log(table);
    	start();
    });
} //end low()

function addQuery(){
	
	
	var query = connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", 



		function(err, res) {
    	if (err) throw err;

    	// console.log(res);

    	// -----------create a for loop to sift through the res array and display the id, name, prices, and quantity---
    	for (var i = 0; i < res.length; i++){
    		array.push(res[i].product_name);
    		// console.log(res[i].product_name);
    	}
    	addPrompt();
    	});
		// console.log("array line 109", array);
		



} //end addPrompt


function addPrompt(){
	// var array = array;
	// console.log("array", array);

	// inquirer prompt to add inventory -- make sure to install isNumber npm and require it up top
	inquirer.prompt([
		{
      		type: "list",
      		message: "Which item would you like to add inventory to?",
      		choices: array,
      		name: "choice"
    	},
		{
      		type: "input",
      		message: "How many would you like to add to inventory?",
      		name: "amount"
    	},
    	
    
  	]).then(function(user) {
  		var amount = user.amount;
  		var choice = user.choice;
  		
  			if(isNumber(amount) === true){
          		
          		//create a function to find current amount and add amount to it
          		currentAmt(choice, amount);


  			} //end if
  			// else{
  			// 	console.log(amount, "is not a number");
  			// 	start();
  			// }
  			
  			
  	}); // end .then
	
// start();
} //end addPrompt()









function currentAmt(choice, amount){
	var choice = choice;
	var amount = amount;
	var inStock;

	var query = connection.query("SELECT stock_quantity FROM products WHERE ?", 
			
			{
			product_name: choice
			},
			
		
		function(err, res) {
    	if (err) console.log("error on line 153");
    	inStock = parseInt(res[0].stock_quantity);
		
    	add(choice,amount, inStock);

 		// connection.end();
  		}); //end function(err, res)

	

} //end choice()

function add(choice, amount, inStock){
	var choice = choice;
	var amount = parseInt(amount);
	var inStock = inStock;
	var newAmt = amount + inStock

	var query = connection.query("UPDATE products SET ? WHERE ?", 
		[	
			{
				stock_quantity: newAmt
			},
			{
				product_name: choice
			},
		],
		function(err, res) {
    	if (err) console.log("error line 128");
    	console.log("There are now", newAmt, choice + "s in inventory");

 		// connection.end();
  		}); //end function(err, res)

	start();
} //end add()

function createNewProduct(){
	inquirer.prompt([
		{
      		type: "input",
      		message: "Enter product name: ",
      		name: "name"
    	},
    	{
      		type: "input",
      		message: "Enter department name: ",
      		name: "department"
    	},
    	{
      		type: "input",
      		message: "Enter price: ",
      		name: "price"
    	},
    	{
      		type: "input",
      		message: "Enter in-stock quantity: ",
      		name: "quantity"
    	},
    
  	]).then(function(user) {
  			var name = user.name;
  			var department = user.department;stock_quantity: quantity
  			var price = parseFloat(user.price);
  			var quantity = parseInt(user.quantity);

  			addNewProduct(name, department, price, quantity);

  	}); // end .then

} //end createNewProduct



function addNewProduct(name, department, price, quantity) {
	var name = name;
	var department = department;
	var price = price;
	var quantity = quantity;

  connection.query(
  	"INSERT INTO products SET ?", 
 
  {
  	product_name: name,
  	department_name: department,
  	price: price,
  	stock_quantity: quantity
  },

  	function(err, res) {
    if (err) console.log("error on line 234.  won't add new item into inventory", err);
    else{
    	console.log("new product added");
    }
    
  });
   connection.end();
} //end addNewProduct

