const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(`${process.env.DB_URL}movie-review`,{
        useNewUrlParser: true,
        useUnifiedTopoLogy: true,
    }).then((data)=>{
        console.log(`mongo db connected with server ${data.connection.host}`);
    })
}


module.exports = connectDatabase