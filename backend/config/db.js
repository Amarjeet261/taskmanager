import mongoose from "mongoose";

export const connectDB = async() => await mongoose.connect('mongodb+srv://taskmanager_db_user:taskmanager_db@taskmanagercluster.fiibdig.mongodb.net/TaskManagerCluster').then(()=>console.log('DB Connected'));