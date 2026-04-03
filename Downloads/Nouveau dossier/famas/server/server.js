const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Capture toutes les erreurs non gérées
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message, err.stack);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => res.json({ message: 'Famas API is running' }));

// Connexion MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Serveur démarré sur le port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error('Erreur MongoDB:', err));
