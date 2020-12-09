DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,2) NULL,
  department_id INTEGER NOT NULL,
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department_id FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  INDEX role_ind (role_id),
  CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  INDEX man_ind (manager_id),
  CONSTRAINT fk_manager_id FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Dev");

INSERT INTO role (title, salary, department_id)
VALUES ("Business Development Manager", 72000.00, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Back-end Manager", 100000.00, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Back-end Developer", 80000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dave", "Abalos", 2, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Maxx", "Richmond", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mickey", "Myhan", 1, NULL);

DELETE FROM department WHERE id = 4;