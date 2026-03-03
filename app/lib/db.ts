import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;


    if (connectionState === 1){
        console.log('already connected')
        return;
    }

    if (connectionState === 2){
        console.log('connecting...')
        return;
    }

    try{
        mongoose.connect(MONGODB_URI!,{
            dbName : 'z22004500210111_db_user',
            bufferCommands : true,
        });
        console.log('connected');
    }catch (err:any){
        console.log("Error :",err);
        throw new  Error ("Error :",err);
    }
};

export default connect;