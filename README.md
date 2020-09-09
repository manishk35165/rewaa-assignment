# Inventory Management Service

This application has two parts:

  - App Frontend
  - App Backend

# App Frontend
Application frontend is build on Angular 9. It has following components:
  - Login Page
  - Product listing page
  - Add new product page
  - Update exiting product page
  - Delete a particular product
  - Logout button
  
### Run front end
To run the frontend, execute following command:
> npm install
> npm start

# App Backend
Application backend has following apis to perform all task requested from frontend.

- 'GET /products' : Fetch all products.
- 'GET /products/<id>': Get a particular product details using its id.
- 'POST /products': create a new product.
- 'PUT /products/<id>': Update existing product.
- 'DELETE /products/<id>': Delete existing product.
- 'POST /users/autheticate': Authenticate a user when login.

### Database details
This application use MySQL database. Following database and tables are required to run the application backend.

```sh
CREATE DATABASE product_db;

CREATE TABLE product_db.product(
	id INT(11) PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(200),
	price INT(11),
	quantity INT(11),
	description varchar(1000),
	owner int(11),
	FOREIGN KEY (owner) REFERENCES users(id)
)ENGINE=INNODB;


CREATE TABLE product_db.users(
	id INT(11) primary key AUTO_INCREMENT,
	username VARCHAR(200),
	name VARCHAR(200),
	password varchar(100),
	token varchar(1000)
)ENGINE=INNODB;

INSERT INTO `product_db`.`users`
(`username`,
`name`,
`password`, `token`)
VALUES
('manish',
'Manish Kumar', '123456', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmb28iLCJiYXIiOiJiYXoifQ.1MOXGiwGTFLU7-YMvOe2_q2ZRUHAMCVS7pbnOkRKCFV1HIvY8odBaqWVCQRuT2RUbKtGgA2elFRsuka4K1KP7A' );

```
### Running backend
> npm install
> node index

This command should show following log on command line:

>Server started on port 3000...
Mysql Connected...

# What has been covered?
- Architecture and application design: YES
- Functional requirements: YES
- Code quality: YES
- Test Coverage: NO
- Application Screenshots: YES
- Token based Authentication: YES
