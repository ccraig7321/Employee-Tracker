DROP DATABASE IF EXISTS employeeTracker_DB;

CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT (3),
  manager_id INT (3),
  PRIMARY KEY (id)
);

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL (10, 2) NOT NULL,
  department_id INT (3),
  PRIMARY KEY (id)
);