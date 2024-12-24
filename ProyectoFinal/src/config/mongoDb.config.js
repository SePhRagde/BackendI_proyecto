import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {

    mongoose.connect("mongodb+srv://sephragde:PE0UxxhjVGZZJ5Ie@finalbackendi.gujqk.mongodb.net/?retryWrites=true&w=majority&appName=FinalBackendI")
    console.log("Mongo DB Connected");
  } catch (error) {
    console.log(error);
  }
}