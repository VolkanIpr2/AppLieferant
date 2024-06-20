import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { con: null, promise: null };
}

async function dbConnect() {
    if (cached.con) {
        // console.log('DB Verbindung aktiv');
        return cached.con;
    }

    if (!cached.promise) {
        const options = {
            bufferCommands: false,
            // Weitere Optionen bei Bedarf hinzufügen
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, options).then((mongoose) => {
            // console.log('DB Verbindung gestartet');
            return mongoose;
        });
    }
    cached.con = await cached.promise;
    return cached.con;
}

async function dbDisconnect() {
    if (cached.con) {
        await mongoose.disconnect();
        cached.con = null;
        // console.log('DB Verbindung beendet');
    }
}

const mongodb = { dbConnect, dbDisconnect };
export default mongodb;
