const mongoose = require("mongoose");
const chalk = require('chalk');
const connectDB = async ()=>{
    try{
        const connecton = mongoose.connect(process.env.MONGO_URI,{
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        console.log(`MongoDB is connected:${chalk.bgRed(process.env.MONGO_URI)} `);
        
    }catch(err){
        console.log(err);
        process.exit(1)
        
    }
        
}
module.exports = connectDB;