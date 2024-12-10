CREATE DATABASE taskstodo;
USE taskstodo;

CREATE TABLE tasks (
    id_task INT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(100) ,
    task_date DATE ,
    task_time TIME ,
    task_description VARCHAR(255),
    is_completed BOOLEAN DEFAULT FALSE
);


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `taskCompleted`(IN id_task INT)
BEGIN
    UPDATE tasks SET is_completed = TRUE WHERE id_task = id_task;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `seeTasks`()
BEGIN
    SELECT * FROM tasks;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `addTask`(
    IN task_name VARCHAR(100),
    IN task_date DATE,
    IN task_time TIME,
    IN task_description VARCHAR(255)
)
BEGIN
    INSERT INTO tasks (task_name, task_date, task_time, task_description)
    VALUES (task_name, task_date, task_time, task_description);
END ;;
DELIMITER ;

DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `editTask`(
    IN id_task INT,
    IN task_name VARCHAR(100),
    IN task_date DATE,
    IN task_time TIME,
    IN task_description VARCHAR(255)
)
BEGIN
    UPDATE tasks
    SET task_name = task_name,
        task_date = task_date,
        task_time = task_time,
        task_description = task_description
    WHERE id_task = id_task;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteTask`(IN id_task INT)
BEGIN
    DELETE FROM tasks WHERE id_task = id_task;
END ;;
DELIMITER ;



