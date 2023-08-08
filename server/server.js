const app = require("./app");
const connectDatabase = require("./db/Database.js");


//Handeling uncaugth Exeption
process.on("uncaughtException", (err) => {
    console.log("Error: " + err.message);
    console.log("shutting down the server for handeling uncaugth exeption");
  });


//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./config/.env",
  });
}


//conect DB
connectDatabase();


const server = app.listen(process.env.PORT, () => {
  console.log("server running on http://localhost:" + process.env.PORT);
});


//unhandled promise rejection

process.on("unhandledRejection", (err) => {
    console.log(`shutting down the server for ${err.message}`);
    console.log("shutting down the server for unhandled promise rejection");
  
    server.close(() => {
      process.exit(1);
    });
  });
  