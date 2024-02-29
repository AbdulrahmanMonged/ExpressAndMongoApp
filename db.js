const mongoose = require("mongoose")

const connectToDb = async () => {
    await mongoose.connect('mongodb://localhost:27017/shopApp')
    console.log("Connected to db Successfully") 
}

const disconnect = async () => {
    await mongoose.disconnect();
}
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: [String],
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy']
    }

})

const Product = new mongoose.model('Product', productSchema);



exports.connectToDb = connectToDb;
exports.disconnect = disconnect;
exports.Product = Product