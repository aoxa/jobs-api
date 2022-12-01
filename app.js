require('dotenv').config();
require('express-async-errors');
const express = require('express');
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs')
const connectDB = require('./db/connect')
const authenticationMiddleware = require('./middleware/authentication')
//security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimitter = require('express-rate-limit')


//Swagger
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('yamljs').load('./swagger.yaml')

const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// if it is behind rev proxy:
app.set('trust proxy', 1)
app.use(rateLimitter({
  windowMs: 15 * 60* 1000,
  max: 100
}))

app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.get('/', (req, res) => {
  res.send('<a href="/swagger-ui>Swagger API</a>');
});
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticationMiddleware, jobRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.DATASOURCE_URL)
    app.listen(port, '0.0.0.0', () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
