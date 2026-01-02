require('dotenv').config();

const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const secure = require('ssl-express-www');
const pg = require('pg');
const path = require('path')

// Crypto is required for session encryption - fail fast if unavailable
const crypto = require('crypto');

const PORT = process.env.PORT || 5001;

// Maximum age of sessions. What happens when cookie expires, but webpage still has old code?
const oneDay = 1000 * 60 * 60 * 24;

const app = express();

// cookie parser middleware
app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV != "local") {
    app.use(secure);
}

// Validate session secret is configured
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    console.error('WARNING: SESSION_SECRET should be set and at least 32 characters for security');
}

// Session middleware configuration
// Note: sameSite:'none' is required in production because this app is designed to be
// embedded in iframes on external sites. This requires secure:true (HTTPS).
app.use(session({
    proxy: true,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,  // Don't create sessions for unauthenticated users
    cookie: {
        maxAge: oneDay,
        secure: process.env.NODE_ENV !== "local",  // HTTPS required in production
        sameSite: process.env.NODE_ENV === "local" ? 'Lax' : 'none',  // 'none' required for iframe embedding
        httpOnly: true  // Prevent client-side JS access to cookie
    },
    resave: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Track database connection status
let dbConnected = false;

// Connect to the circuit_db database. We leave the connection open all the time.
console.log("Start persistent connection to database.");
const client = process.env.NODE_ENV === 'local'
    ? new pg.Client({database: "circuit_db"})
    : new pg.Client({
        user: process.env.REMOTE_PGUSER,
        password: process.env.REMOTE_PGPASSWORD,
        database: process.env.REMOTE_PGDATABASE,
        port: process.env.REMOTE_PGPORT,
        host: process.env.REMOTE_PGHOST,
        ssl: {
            // WARNING: rejectUnauthorized:false disables certificate validation.
            // This is required for some cloud database providers (e.g., Heroku) that use
            // self-signed certificates. For production with proper certs, set to true.
            rejectUnauthorized: false
        }
    });

// Attempt connection asynchronously (non-blocking)
client.connect()
    .then(() => {
        console.log('✓ Database connected successfully');
        dbConnected = true;
        // Create table if needed after successful connection
        return createTableIfNotExist();
    })
    .catch(err => {
        console.warn('⚠ Database connection failed - save/load features disabled');
        console.warn('⚠ Circuit simulator will work normally');
        console.warn('Error:', err.message);
    });

// Endpoints
app.get('/getcode', function(req, res){
    // Check database availability first
    if (!dbConnected) {
        return res.status(503).json({
            error: 'Database not available'
        });
    }

    if (req.session.timetoken) {
        // Already have a code in this session - just return the same code
        res.json({code: req.session.encrypted});
    } else {
        req.session.savingCircuit = false;
        req.session.loadingCircuit = false;

        // Create a session token based on the current time
        req.session.timetoken = process.hrtime()[1];
        req.session.iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(process.env.CIPHER_ALGORITHM, process.env.CIPHER_SECRET, req.session.iv);
        req.session.encrypted = Buffer.concat([cipher.update(req.session.timetoken.toString()), cipher.final()]).toString('base64');
        req.session.loadTimer = null;
        req.session.circuitJSONArray = [];
        // Send the encrypted token
        res.json({code: req.session.encrypted});

    }
});

app.post('/savecircuit', function(req, res){
    // Check database availability first
    if (!dbConnected) {
        return res.status(503).json({
            error: 'Database not available',
            message: 'Cannot save circuits without database connection'
        });
    }

    // Decipher the encrypted token
    console.log("Saving circuit")
    const decipher = crypto.createDecipheriv(process.env.CIPHER_ALGORITHM, process.env.CIPHER_SECRET, Buffer.from(req.session.iv, 'hex'));
    let decrypted = Buffer.concat([decipher.update(Buffer.from(req.body.code, 'base64')), decipher.final()]).toString();

    // Check if the decrypted token and the saved token for this session are the same.
    if (decrypted == req.session.timetoken)
    {
        // The code matched. We can continue.
        console.log("Code accepted.")
        // Now we need to validate that the circuit has good data.
        if (!validateCircuit(req.body.circuit))
        {
            // This is a bad circuit.
            console.log("Bad circuit.")
            res.end(JSON.stringify({result: "Bad circuit."}));
            return;
        }
        console.log("Circuit validated.")
        // This is a good circuit and now we can commit it to the database.
        // Find the next link ID from the database
        // Database stores data in rows of [ID] [Date/Time] [UserIP] [TimesAccessed] [CircuitJSON]
        console.log("Committing to database.")

        // Send it to the database with link ID, IP address of user, and date/time
        saveToDatabase(req.session, req.socket.remoteAddress, req.body.circuit);

        res.end(JSON.stringify({result: "Circuit accepted."}));
    }
    else
    {
        console.log("Code not accepted.")
        res.end(JSON.stringify({result: "Circuit not accepted."}));
    }
});

app.post('/getlink', function(req, res) {
    // Check database availability first
    if (!dbConnected) {
        return res.status(503).json({
            error: 'Database not available'
        });
    }

    const decipher = crypto.createDecipheriv(process.env.CIPHER_ALGORITHM, process.env.CIPHER_SECRET, Buffer.from(req.session.iv, 'hex'));
    let decrypted = Buffer.concat([decipher.update(Buffer.from(req.body.code, 'base64')), decipher.final()]).toString();

    if (decrypted == req.session.timetoken)
    {
        console.log("getlink: Code accepted.")
        // Check if still saving the circuit.
        if (req.session.savingCircuit)
        {
            // No link ID just yet...
            // Send a 0 to indicate it's not finished.
            res.end(JSON.stringify({status: "Please wait. Still saving circuit.", link: ''}));
            console.log("getlink: Still saving circuit.")
        }
        else {
            // Return the resulting link.
            res.end(JSON.stringify({status: 'success', link: req.session.link_ID}));
            console.log("getlink: " + req.session.link_ID);
        }
    }
    else
    {
        res.end(JSON.stringify({status: 'Invalid code.', link: ''}));
        console.log("getlink: invalid code");
    }
});

app.post('/getcircuit', function(req, res) {
    // Check database availability first
    if (!dbConnected) {
        return res.status(503).json({
            error: 'Database not available'
        });
    }

    const decipher = crypto.createDecipheriv(process.env.CIPHER_ALGORITHM, process.env.CIPHER_SECRET, Buffer.from(req.session.iv, 'hex'));
    let decrypted = Buffer.concat([decipher.update(Buffer.from(req.body.code, 'base64')), decipher.final()]).toString();

    if (decrypted == req.session.timetoken) {
        console.log("getcircuit: Code accepted.");

        // Validate linkID is a positive integer
        const linkID = parseInt(req.body.linkID, 10);
        if (isNaN(linkID) || linkID <= 0) {
            return res.status(400).json({status: "Invalid link ID.", circuitJSON: ''});
        }

        // Find the linkID in the circuit JSONs we have.
        let positionOfLinkID = -1;
        for (let i = 0; i < req.session.circuitJSONArray.length; i++) {
            if (req.session.circuitJSONArray[i].linkID == linkID) {
                positionOfLinkID = i;
                break;
            }
        }

        if (positionOfLinkID != -1)
        {
            // Return the circuit.
            console.log("getcircuit: Sent circuit JSON.");
            res.end(JSON.stringify({status: 'success', circuitJSON: req.session.circuitJSONArray[positionOfLinkID]}));
            // Now that I've returned it, delete that array member.
            req.session.circuitJSONArray.splice(positionOfLinkID, 1);
        }
        else
        {
            console.log("getcircuit: Still loading circuit.");
            res.end(JSON.stringify({status: "Please wait. Still loading circuit.", circuitJSON: ''}));
        }
    }
    else
    {
        res.end(JSON.stringify({status: 'Invalid code.', link: ''}));
        console.log("getcircuit: Invalid code.");
    }
});

app.post('/loadcircuit', function(req, res) {
    // Check database availability first
    if (!dbConnected) {
        return res.status(503).json({
            error: 'Database not available',
            message: 'Cannot load circuits without database connection'
        });
    }

    const decipher = crypto.createDecipheriv(process.env.CIPHER_ALGORITHM, process.env.CIPHER_SECRET, Buffer.from(req.session.iv, 'hex'));
    let decrypted = Buffer.concat([decipher.update(Buffer.from(req.body.code, 'base64')), decipher.final()]).toString();

    if (decrypted == req.session.timetoken) {
        console.log("loadcircuit: Code accepted.");

        // Validate linkID is a positive integer to prevent injection attacks
        const linkID = parseInt(req.body.linkID, 10);
        if (isNaN(linkID) || linkID <= 0) {
            return res.status(400).json({result: "Invalid link ID."});
        }

        let result = loadFromDatabase(req.session, linkID);

        if (result)
        {
            res.end(JSON.stringify({result: "Circuit is loading."}));
        }
        else
        {
            res.end(JSON.stringify({result: "Link ID doesn't exist."}));
        }
    }
    else
    {
        console.log("Code not accepted.");
        res.end(JSON.stringify({result: "Code not accepted."}));
    }
});

async function loadFromDatabase(session, linkID)
{
    // Check to see if we're in the middle of loading a circuit.
    if (session.loadingCircuit)
        return;

    session.loadingCircuit = true;

    let circuitLoadedCorrectly = false;

    // Load the JSON data from the row at the link id.
    // Using parameterized query to prevent SQL injection
    await client.query("SELECT circuit_json FROM circuit_table WHERE link_id = $1", [linkID]).then(res => {
        if (res.rowCount > 0) {
            let circuitJSON = {linkID: linkID, circuitJSON: res.rows[0]['circuit_json']};
            session.circuitJSONArray.push(circuitJSON);
            circuitLoadedCorrectly = true;
        }
    }).catch(err => {
        console.error("Failed to retrieve circuit for linkID:", linkID);
        console.error("Database error:", err.message);
        if (process.env.NODE_ENV === 'local') {
            console.error(err.stack);
        }
    });

    if (circuitLoadedCorrectly) {
        // Increment the number of times accessed by 1.
        // Using parameterized query to prevent SQL injection
        await client.query("UPDATE circuit_table SET times_accessed = times_accessed + 1 WHERE link_id = $1", [linkID]).then(res => {
            console.log("Incremented access count for linkID:", linkID);
        }).catch(err => {
            console.error("Failed to increment access count for linkID:", linkID);
            console.error("Database error:", err.message);
            if (process.env.NODE_ENV === 'local') {
                console.error(err.stack);
            }
        });
    }

    session.loadingCircuit = false;
    session.save();

    if (circuitLoadedCorrectly)
        return true;

    return false;
}

// Call this function to begin saving data to the database. Client will have to get link in a later function.
async function saveToDatabase(session, user_IP, circuitJSON)
{
    // Check to see if we're in the middle of saving the last circuit.
    if (session.savingCircuit)
        return;

    session.link_ID = 0; // 0 is failure;
    session.savingCircuit = true;

    console.log('saveToDatabase: About to INSERT circuit');
    // Insert the circuit into the table.
    // Using parameterized query to prevent SQL injection
    try {
        const res = await client.query(
            "INSERT INTO circuit_table (user_ip, date_added, times_accessed, circuit_json) VALUES ($1, current_timestamp, 0, $2) RETURNING link_id",
            [user_IP, circuitJSON]
        );
        console.log("Inserted circuit successfully with link_id:", res.rows[0]['link_id']);
        session.link_ID = res.rows[0]['link_id'];
    } catch (err) {
        console.error("Failed to insert circuit from IP:", user_IP);
        console.error("Database error:", err.message);
        if (process.env.NODE_ENV === 'local') {
            console.error(err.stack);
        }
    } finally {
        session.savingCircuit = false;
        session.save();
    }
}

// Make sure it has all the JSON fields it should.
// Make sure it is not empty.
// Make sure it is not ridiculously large.
function validateCircuit(circuitJSON)
{
    // Validate input type
    if (typeof circuitJSON !== 'string' || circuitJSON.length === 0) {
        console.log("Invalid circuit JSON: not a string or empty.");
        return false;
    }

    // Check size limit first (before parsing)
    if (circuitJSON.length > 100000) {
        console.log("Circuit JSON too large.");
        return false;
    }

    let circuitData;
    try {
        circuitData = JSON.parse(circuitJSON);
    } catch (err) {
        console.log("Invalid circuit JSON: parse error -", err.message);
        return false;
    }

    if (circuitData['version'])
    {
        if (circuitData['version'] == 1) {
            // Check if it has the proper fields
            if (!circuitData['centerPoint'] ||
                !circuitData['zoom'] ||
                !circuitData['parts'] ||
                !circuitData['chains'])
            {
                console.log("Incorrect properties.");
                return false;
            }

            // Check to make sure that the parts are not empty
            if (circuitData['parts'].length == 0) {
                console.log("No parts.");
                return false;
            }

            return true;
        }
        console.log("No version 1");
        // TODO: Add future version handling here.
    }
    console.log("No version");
    return false;
}

const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please kill the process using this port or use a different port.`);
    process.exit(1);
  }
});

// Simplified function to create table if needed (assumes already connected to database)
async function createTableIfNotExist() {
    try {
        await client.query("CREATE TABLE IF NOT EXISTS circuit_table (link_id SERIAL PRIMARY KEY, user_IP VARCHAR(255), date_added TIMESTAMPTZ, times_accessed BIGINT, circuit_json TEXT);");
        console.log("Table ready.");
    } catch (err) {
        console.log("Table creation failed:", err.message);
    }
}