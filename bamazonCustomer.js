var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({

	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Wolfpack83',
	database: 'bamazon'

});

connection.connect(function(err){
	if(err) throw err;
	console.log('connected as id ' + connection.threadId);
	
	//call start function here
	start();
});

function start(){

	var query = connection.query("SELECT * FROM products", 


		function(err, res) {					
    if (err) throw err;
    	res.forEach(function(items){
    		console.log("\r\nItem ID: " + items.item_id + "\tProduct: " + items.product_name +
                "\tPrice: $" + items.price + "\tIn Stock: " + items.stock_quantity);
    	});
 	}); //end connection.query

	inquirer.prompt([
    	// Here we create a basic text prompt.
    	
    	{
      		type: "input",
      		message: "What is the ID of the product you would like to buy?",
      		name: "id"
    	},
    	{
    		type: "input",
      		message: "How many units of the product you would like to buy?",
      		name: "units"

    	}
    
  	]).then(function(user) {
  			var id = user.id;
   			var units = user.units;

  			check(id, units);
  			
  	}); // end .then

}  //end start()

function check(id, units){
	
	var id = id;
	var units = units;
	// var unitCost;
	// console.log("unitCost", unitCost);
	
	var query = connection.query("SELECT stock_quantity FROM products WHERE ?", 

		{
			item_id: id
		},

		function(err, res) {					
    if (err) throw err;
    // console.log(res);
    // console.log(res);
    var quantityOnHand = res[0].stock_quantity;

    //check to see if purchase quantity is less than in-stock quantity
    if(units <= quantityOnHand){
    	buy(id, units, quantityOnHand);
    	cost(id, units);
    }else{
    	console.log("Insufficient quantity on hand");
    	console.log("Only", quantityOnHand, "in stock");
    	start();
    }

    // connection.end();
  });

} //end check()

function buy(id, units, quantityOnHand){
	
	var id = id;
	var units = units;
	var quantityOnHand = quantityOnHand;
	var newQuantity = quantityOnHand - units;
	var unitCost = unitCost;
	// console.log("new quantity", newQuantity);
	

	var query = connection.query("UPDATE products SET ? WHERE ?", 
	[	
		{
			stock_quantity: newQuantity
		},
		{
			item_id: id
		},
	],
		function(err, res) {
    if (err) throw err;
    // console.log(res.affectedRows + " products updated!\n");


 // connection.end();
  }); //end function(err, res)



}//end buy()

function cost(id, units){

	var id = id;
	var units = units;
	var bill;
	var department;
	// var productSales;

	var query = connection.query("SELECT price, department_name, product_sales FROM products WHERE ?",
		{
			item_id: id
		},

		function(err, res) {
   		if (err) throw err;
   		
   		var price = res[0].price;
   		var productSales = parseFloat(res[0].product_sales);
   		// console.log("product sales inside the cost function", productSales);

   		department = res[0].department_name;
   		bill = units * price;
   		// console.log("Your total bill is $" + bill);

   		updateDepartmentSales(id, bill, productSales);
   		});  //end first query

	

} //end cost

function updateDepartmentSales(id, bill, productSales){
	var id = id;
	
	var bill = parseFloat(bill);
	
	var product_sales = parseFloat(productSales);
	// console.log("product sales inside the updateDepartmentSales function", productSales);

	var newProductSales = parseFloat(bill + product_sales);
	// console.log("new product sales line 156", newProductSales);

	// console.log("department line 148", department);

	var query = connection.query("UPDATE products SET ? WHERE ?",
	[	
		{
			product_sales: newProductSales
		},
		{
			item_id: id
		},
	],
		
		function(err, res) {
   		if (err) throw err;
   		console.log("Your total bill is $" + bill);
   		// console.log("Product sales", productSales);
   		});  //end second query
}
