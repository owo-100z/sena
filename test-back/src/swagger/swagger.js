const path = require('path');
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.1.0' });

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "API 문서",
      version: "1.0.0",
      description: "프로젝트 API 문서입니다.",
    },
    servers: [
        {
            url: `http://localhost:${process.env.API_PORT || 3000}`,
        },
    ],
    schemes: ['http', 'https'],
  },
};

const outputFile = path.resolve(__dirname, './swagger.json');
const endpointFiles = [path.resolve(__dirname, '../index.js'), path.resolve(__dirname, '../openapi/*.js')];
swaggerAutogen(outputFile, endpointFiles, options);