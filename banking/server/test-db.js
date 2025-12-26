import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

console.log("Testing MongoDB Connection...");
console.log("URL:", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
    dbName: 'banking'
})
    .then(async () => {
        console.log("✅ MongoDB Connected Successfully!");

        // Create a dummy schema/model to test query
        const TestSchema = new mongoose.Schema({ name: String });
        const TestModel = mongoose.model('Test', TestSchema);

        console.log("Attempting a query...");
        try {
            const result = await TestModel.findOne({});
            console.log("✅ Query executed successfully (result might be null, that's fine):", result);
            process.exit(0);
        } catch (queryErr) {
            console.error("❌ Query Failed:", queryErr);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error("❌ Connection Failed:", err);
        process.exit(1);
    });
