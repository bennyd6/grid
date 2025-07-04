const mongoose=require('mongoose');

const MONGO_URI="mongodb+srv://cadheshbenny:snmXLDw0Q5XwwiID@cluster0.flih7yf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


const connectToMongo = () => {
    mongoose.connect(MONGO_URI)
        .then(() => console.log("MongoDB Connected...."))
        .catch((e) => {
            console.error("MongoDB connection error:", e);
        });
};


module.exports=connectToMongo