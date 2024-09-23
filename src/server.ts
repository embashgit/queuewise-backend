import express, {Express} from 'express';
import sequelize from './config/config';
import dotenv from 'dotenv';
import routes from './routes';
import { initializeModels } from './models';
import cors from 'cors';

dotenv.config();

const app: Express = express();


const corsOptions = {
  credentials: true,
  methods: 'GET,PUT,PATCH,POST,DELETE',
};

// log information
// app.use(GeneralHelper.httpLogger());

// allows cors request with cors settings
app.use(cors(corsOptions));

// limit the size of the request
app.use(express.json({
  limit: process.env.MAX_FILE_SIZE || '10mb',
}));
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
    await sequelize.sync({ alter: true });
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log('Error starting server: ', error);
  }
};

startServer();
