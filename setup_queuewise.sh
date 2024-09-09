#!/bin/bash

# Create project root folder
echo "Creating project folder structure..."

mkdir -p queuewise-backend/src/{config,controllers,models,routes}

# Create package.json with npm init -y
cd queuewise-backend || exit
npm init -y

# Install required dependencies
echo "Installing required dependencies..."
npm install express pg sequelize dotenv
npm install --save-dev typescript @types/node @types/express @types/sequelize ts-node nodemon

# Initialize TypeScript project
npx tsc --init

# Modify tsconfig.json for the project
echo "Configuring TypeScript settings..."
cat <<EOL > tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
EOL

# Create .env file
echo "Creating .env file..."
cat <<EOL > .env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=queuewise_db
DB_PORT=5432
EOL

# Create nodemon.json file
echo "Creating nodemon.json..."
cat <<EOL > nodemon.json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node src/server.ts"
}
EOL

# Create config.ts file
echo "Creating config.ts..."
cat <<EOL > src/config/config.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT as string, 10),
  }
);

export default sequelize;
EOL

# Create Queue.ts model file
echo "Creating Queue.ts model..."
cat <<EOL > src/models/Queue.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config';

class Queue extends Model {
  public id!: string;
  public eventType!: string;
  public queueLength!: number;
  public estimatedWaitTime!: number;
}

Queue.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  queueLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estimatedWaitTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Queue',
  timestamps: true,
});

export default Queue;
EOL

# Create queueController.ts
echo "Creating queueController.ts..."
cat <<EOL > src/controllers/queueController.ts
import { Request, Response } from 'express';
import Queue from '../models/Queue';

// Get all queues
export const getAllQueues = async (req: Request, res: Response): Promise<void> => {
  try {
    const queues = await Queue.findAll();
    res.status(200).json(queues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching queues', error });
  }
};

// Create a new queue
export const createQueue = async (req: Request, res: Response): Promise<void> => {
  const { eventType, queueLength, estimatedWaitTime } = req.body;
  try {
    const newQueue = await Queue.create({ eventType, queueLength, estimatedWaitTime });
    res.status(201).json(newQueue);
  } catch (error) {
    res.status(500).json({ message: 'Error creating queue', error });
  }
};
EOL

# Create queueRoutes.ts
echo "Creating queueRoutes.ts..."
cat <<EOL > src/routes/queueRoutes.ts
import { Router } from 'express';
import { getAllQueues, createQueue } from '../controllers/queueController';

const router = Router();

// GET all queues
router.get('/queues', getAllQueues);

// POST a new queue
router.post('/queues', createQueue);

export default router;
EOL

# Create server.ts
echo "Creating server.ts..."
cat <<EOL > src/server.ts
import express from 'express';
import sequelize from './config/config';
import dotenv from 'dotenv';
import queueRoutes from './routes/queueRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', queueRoutes);

// Sync Database and Start Server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    await sequelize.sync();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
  } catch (error) {
    console.log('Error starting server: ', error);
  }
};

startServer();
EOL

echo "Project setup is complete!"
