import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import { Express } from 'express';
import path from 'path';

const swaggerDocument = yaml.load(path.resolve(__dirname, 'swagger.yaml'));

const PORT = process.env.PORT || 8000;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;
swaggerDocument.servers[0].url = API_BASE_URL;

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`Swagger docs available at: ${API_BASE_URL}/api-docs`);
}
