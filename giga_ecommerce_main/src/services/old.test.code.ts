
// const getAllProducts = async () => {
//     const products = await Product.find().populate('productReviews');

//     return products;
// };

// const createProduct = async (data: any) => {
//     const { vendor, shop, productName, productDisplayName, productDescription, productCategory, productSubCategory, productImages, productPrice, productAmountInStock, productFulfilmentTime } = data;
//     const product = await Product.create({ vendor, shop, productName, productDisplayName, productDescription, productCategory, productSubCategory, productImages, productPrice, productAmountInStock, productFulfilmentTime });

//     return product;
// };

// const updateProduct = async (data: any) => {
//     const { id, productName, productDisplayName, productDescription, productCategory, productSubCategory, productImages, productPrice, productAmountInStock, productFulfilmentTime } = data;
//     const product = await Product.findOne({ _id: id });

//     if (product) {
//         product.productName = productName;
//         product.productDisplayName = productDisplayName;
//         product.productDescription = productDescription;
//         product.productCategory = productCategory;
//         product.productSubCategory = productSubCategory;
//         product.productImages = productImages;
//         product.productPrice = productPrice;
//         product.productAmountInStock = productAmountInStock;
//         product.productFulfilmentTime = productFulfilmentTime;
//         await product.save();
//     }

//     return product;
// };

// const getProductByName = async (name: string) => {
//     //using elastic search

//     //using mongodb search
//     const products = await Product.find({
//         $text: {
//             $search: name
//         }
//     });

//     return products;
// };

// const queryProductBYId = async (id : string) => {
    
// }

// export default {
//     getAllProducts,
//     createProduct,
//     updateProduct,
//     getProductByName,
//     queryProductBYId
// };