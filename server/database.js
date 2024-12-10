import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();

export async function taskCompleted(id) {
  await pool.query(`CALL taskCompleted(?);`, [id]);
}

export async function addTask(name, date, time, description) {
  await pool.query(
    `CALL addTask(?, ?, ?, ?);`,
    [name, date, time, description]
  );
}


export async function editTask(id, name, date, time, description) {
  await pool.query(
    `CALL editTask(?, ?, ?, ?, ?);`,
    [id, name, date, time, description]
  );
}

export async function deleteTask(id) {
  await pool.query(`CALL deleteTask(?);`, [id]);
}

export async function seeTasks() {
  const [rows] = await pool.query(`CALL seeTasks();`);
  return rows[0];  
}
