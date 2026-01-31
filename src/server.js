const express = require('express');
const sequelize = require('./config/db');
const sequelize = getSequelize();
require('dotenv').config();

const app = express();
app.use(express.json());

// IMPORT MODEL
const Paste = require('./models/paste');

// ROUTES
app.use('/api', require('./routes/apiRoutes'));
app.use('/', require('./routes/viewRoutes'));

sequelize.sync().then(() => {
  console.log('Database synced ✅');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
