const config=require("./config");
const mysql=require("mysql2");

const pool=mysql.createPool(config.development.database);

const connection=pool.promise();

module.exports=connection;