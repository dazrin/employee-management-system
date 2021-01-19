USE employeeManagement_DB;

INSERT INTO department
    (name)
VALUES
    ("Human Resources"),
    ("R&D"),
    ("Engineering"),
    ("Accounting"),
    ("Sales");


INSERT INTO role
    (title, salary, department_id)
VALUES
("manager", 75000.00, 2),
("engineer", 52000, 3),
("accountant", 62500, 4),
("recruiter", 57500, 1),
("sales person", 85650, 5);


INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
("Naruto", "Uzumaki", 1, NULL),
("Sasuke", "Uchiha", 1, 1),
("Sakura", "Haruno", 3, 2),
("Rock", "Lee", 5, 2);