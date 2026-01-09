const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const os = require('os');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const addressRoutes = require('./routes/addressRoutes');
const placeRoutes = require('./routes/placeRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/place', placeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Locator MVP backend is live' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ message: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  const addressInfo = server.address();
  const bindAddress = typeof addressInfo === 'string' ? addressInfo : addressInfo?.address ?? 'localhost';
  const bindPort = typeof addressInfo === 'string' ? PORT : addressInfo?.port ?? PORT;
  console.log(`Backend listening on http://${bindAddress}:${bindPort}`);

  const interfaces = os.networkInterfaces();
  const visibleAddresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        visibleAddresses.push(`${net.address}:${bindPort}`);
      }
    }
  }

  if (visibleAddresses.length) {
    console.log(`Reachable via: ${visibleAddresses.join(', ')}`);
  } else {
    console.log('Reachable address could not be determined automatically.');
  }
});
