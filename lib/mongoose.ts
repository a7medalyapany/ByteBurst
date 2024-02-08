import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
	mongoose.set('strictQuery', true)

	if (!process.env.MONGODB_URL) {
		console.log('no MongoDB URL defined');
		return;
	}

	if (isConnected) {
		return;
	}

	try {
		await mongoose.connect(process.env.MONGODB_URL, {
			dbName: 'ByteBurst',
		});
		isConnected = true;
	} catch (error) {
		console.log('error connecting to database:', error);
	}
};