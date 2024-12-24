const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true },
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
