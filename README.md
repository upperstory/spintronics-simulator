# Spintronics Simulator

A free, online simulator for Spintronics circuits - mechanical analogues of electronic circuits that use spinning gears and chains.

## Try It Online

**[Launch Simulator](https://dviersel.github.io/spintronics-simulator/)** - No installation required!

## Installation

### Option 1: Download and Run Locally

1. Go to the [Releases](https://github.com/dviersel/spintronics-simulator/releases) page
2. Download the latest `spintronics-simulator-vX.X.X.zip`
3. Extract the zip file
4. Open `index.html` in your browser

### Option 2: Serve with a Local Web Server

For best results, serve the files with a local web server:

```bash
# Download and extract the release, then:

# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

### Option 3: Clone and Build from Source

```bash
# Clone the repository
git clone https://github.com/dviersel/spintronics-simulator.git
cd spintronics-simulator

# Install dependencies
npm install

# Build the static version
npm run build:static

# Serve the built files
npm run serve:static
```

## Features

- Build circuits with various components:
  - Junctions
  - Resistors
  - Capacitors
  - Inductors
  - Transistors
  - Motors
  - Buttons
  - Diodes
  - Ammeters (gauge-style current meters)
  - Phonographs (audio output)
  - Level Changers
- Real-time physics simulation using Planck.js
- Save and share circuits (requires server setup)
- Zoom and pan controls

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run start:local

# Run tests
npm test
```

### Environment Variables

For full functionality with save/load features, configure these environment variables:

| Variable | Description |
|----------|-------------|
| `SESSION_SECRET` | Session encryption secret (32+ characters) |
| `CIPHER_ALGORITHM` | Encryption algorithm for link IDs |
| `CIPHER_SECRET` | Encryption secret for link IDs |
| `REMOTE_PGUSER` | PostgreSQL username |
| `REMOTE_PGPASSWORD` | PostgreSQL password |
| `REMOTE_PGDATABASE` | PostgreSQL database name |
| `REMOTE_PGPORT` | PostgreSQL port |
| `REMOTE_PGHOST` | PostgreSQL host |

## Tech Stack

- **Frontend**: Phaser 3 (rendering), Planck.js (physics)
- **Backend**: Express.js, PostgreSQL
- **Hosting**: Static build works on any web server

## License

MIT
