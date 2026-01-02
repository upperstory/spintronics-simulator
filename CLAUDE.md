# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web-based simulator for Spintronics circuits - mechanical analogues of electronic circuits that use spinning gears and chains. Users can build circuits with various components (junctions, resistors, capacitors, inductors, transistors, motors, etc.) and simulate their physical behavior.

## Development Commands

```bash
# Install dependencies
npm install

# Start the server (default port 5000)
npm start

# Start for local development (disables SSL enforcement)
NODE_ENV=local npm start

# Run tests
npm test
```

## Environment Variables

The server requires these environment variables (configured for production):
- `SESSION_SECRET` - Session encryption secret
- `CIPHER_ALGORITHM`, `CIPHER_SECRET` - For link ID encryption
- Remote PostgreSQL: `REMOTE_PGUSER`, `REMOTE_PGPASSWORD`, `REMOTE_PGDATABASE`, `REMOTE_PGPORT`, `REMOTE_PGHOST`

For local development (`NODE_ENV=local`), the server uses a local PostgreSQL database named `circuit_db`.

## Architecture

### Server (`index.js`)
Express server handling circuit save/load via PostgreSQL. Key endpoints:
- `GET /getcode` - Get session token for saving circuits
- `POST /savecircuit` - Save circuit JSON to database
- `POST /loadcircuit` - Load circuit by link ID
- `POST /getlink` - Get generated link ID after save

### Frontend (Phaser 3 + Planck.js)
The simulator runs in the browser using Phaser 3 for rendering and Planck.js for physics.

**Core modules in `public/`:**
- `spintronicssimulator.js` - Main Phaser scene, UI controls, user interactions
- `part-manager.js` - Manages all circuit parts and chains, handles serialization
- `chain.js` - Chain rendering and physics (connects sprockets together)
- `constants.js` - Shared constants (`worldScale`, `tileSpacing`)

**Parts in `public/parts/`:**
- `partbase.js` - Base class for all parts (extends `Phaser.GameObjects.Container`)
- Individual part files: `junction-part.js`, `resistor-part.js`, `capacitor-part.js`, `inductor-part.js`, `transistor-part.js`, `motor-part.js`, `button-part.js`, `diode-part.js`, `phonograph-part.js`, `level-changer-part.js`, `tile-part.js`, `tile-connector-part.js`

### Key Concepts

**Parts** have sprockets at different levels (heights). Each sprocket has:
- `sprocketCenter` - Position offset from part center
- `sprocketRadius` - Visual radius for rendering
- `sprocketPhysicsRadius` - Physics radius for gear ratios
- `sprocketExists` - Boolean array for which levels have sprockets

**Chains** connect sprockets using tangent line calculations and gear joints. A chain at a specific level connects sprockets of matching radii at that level.

**Circuit serialization** stores part types, positions, values, and chain connections as JSON.

## Physics

The simulator uses Planck.js (a JavaScript port of Box2D) for realistic chain/gear physics:
- Each sprocket has a physics body with a revolute joint
- Chains create gear joints between connected sprockets
- Gear ratios are calculated from sprocket radii and rotation directions (CW/CCW)
