import express, {Express} from 'express';
import sequelize from './config/config';
import dotenv from 'dotenv';
import routes from './routes';
import { initializeModels } from './models';


dotenv.config();

const app: Express= express();

// Middleware
app.use(express.json());

const version = 'v1';
// Routes
app.use(`/api/${version}`, routes);

// Sync Database and Start Server
const startServer = async () => {
  try {
    await initializeModels(); // Sync models before starting the server
    console.log('Database connected...');
    await sequelize.sync();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log('Error starting server: ', error);
  }
};

startServer();
