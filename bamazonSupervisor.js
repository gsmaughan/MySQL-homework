var mysql = require('mysql');
var inquirer = require("inquirer");
const cTable = require('console.table');


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

	inquirer.prompt([
    	// Here we create a basic text prompt.
    	
    	{
      		type: "list",
      		message: "What would you like to do?",
      		choices: ["View Product Sales by Department", "Create New Department"],
      		name: "what"
    	},
    
  	]).then(function(user) {
  			if(user.what === "View Product Sales by Department"){
          		view();
  			} //end if
  			else if(user.what == "Create New Department"){
  				create();
  			}
  			
  	}); // end .t


} //end start()

function view(){  //view product_sales by department


	var query = connection.query("SELECT departments.id, departments.department_name, departments.overhead_cost, products.product_sales, (products.product_sales - departments.overhead_cost) as total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.id",
		function(err, res) {
    	if (err) throw err;

    	const table = cTable.getTable(res);
    	console.log(table);

    	connection.end();

  }); //end connection.query

} //end view()

function create(){

	console.log("create function fired");

	inquirer.prompt([
    	// Here we create a basic text prompt.
    	
    	{
      		type: "input",
      		message: "Enter Department Name",
      		name: "newDepartment"
    	},
    	{
      		type: "input",
      		message: "Enter Department Overhead Cost",
      		name: "overheadCost"
    	},
    	
    
  	]).then(function(user) {
  			var newDepartment = user.newDepartment;
  			var overheadCost = user.overheadCost;

  			insertNewDepartment(newDepartment, overheadCost);
  			
  	}); // end .then


	

}

function insertNewDepartment(newDepartment, overheadCost){

	var newDepartment = newDepartment;
	var overheadCost = parseFloat(overheadCost);

	var query = connection.query(
    "INSERT INTO departments SET ?",
    {
      department_name: newDepartment,
      overhead_cost: overheadCost
    },


    function(err, res) {
    if (err) throw err;
      
      readDepartments();

    }
  );

} //end insertNewDepartment()

function readDepartments(){

	connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    
    const table = cTable.getTable(res);
    console.log(table);

    connection.end();
  });

}