const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const secure = require('ssl-express-www');
const pg = require('pg');
const path = require('path')

let crypto;
try {
    crypto = require('crypto');
} catch (err) {
    console.log('crypto support is disabled!');
}

const PORT = process.env.PORT || 5000;

// Maximum age of sessions. What happens when cookie expires, but webpage still has old code?
const oneDay = 1000 * 60 * 60 * 24;

const app = express();

// cookie parser middleware
app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV != "local") {
    app.use(secure);
}

// For CORS
/*if (process.env.NODE_ENV == "local") {
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://simulator');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
        // Pass to next layer of middleware
        next();
    });
}*/

// session middleware
app.use(session({
    proxy: true,
    secret: process.env.SESSION_SECRET,
    saveUninitialized:true,
    cookie: {
        maxAge: oneDay,
        secure: process.env.NODE_ENV == "local" ? false : true, // when true, only works if proxy is also set to true
        sameSite: process.env.NODE_ENV == "local" ? 'Lax' : 'none' // Allows us to set a cookie even when we're in an iframe
    },
    resave: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Test postgres
const pgconfig = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASS,
    port: process.env.PG_PORT
};

// Create the table in the database if it doesn't exist.
createDatabaseAndTableIfNotExist();

// Connect to the circuit_db database. We leave the connection open all the time.
console.log("Start persistent connection to database.");
const client = process.env.NODE_ENV == 'local' ? new pg.Client({database: "circuit_db"}) : new pg.Client(
    {
        user: process.env.REMOTE_PGUSER,
        password: process.env.REMOTE_PGPASSWORD,
        database:  process.env.REMOTE_PGDATABASE,
        port: process.env.REMOTE_PGPORT,
        host: process.env.REMOTE_PGHOST,
        ssl: {
            rejectUnauthorized: false
        }
    });
client.connect();

// Endpoints
app.get('/getcode', function(req, res){
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
    const decipher = crypto.createDecipheriv(process.env.CIPHER_ALGORITHM, process.env.CIPHER_SECRET, Buffer.from(req.session.iv, 'hex'));
    let decrypted = Buffer.concat([decipher.update(Buffer.from(req.body.code, 'base64')), decipher.final()]).toString();

    if (decrypted == req.session.timetoken) {
        console.log("getcircuit: Code accepted.");
        /*if (req.session.loadingCircuit)
        {
            // No circuit data just yet...
            console.log("getcircuit: Still loading circuit.");
            res.end(JSON.stringify({status: "Please wait. Still loading circuit.", circuitJSON: ''}));

        }
        else {*/
        // Find the linkID in the circuit JSONs we have.
        positionOfLinkID = -1;
        for (let i = 0; i < req.session.circuitJSONArray.length; i++) {
            if (req.session.circuitJSONArray[i].linkID == req.body.linkID) {
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
    const decipher = crypto.createDecipheriv(process.env.CIPHER_ALGORITHM, process.env.CIPHER_SECRET, Buffer.from(req.session.iv, 'hex'));
    let decrypted = Buffer.concat([decipher.update(Buffer.from(req.body.code, 'base64')), decipher.final()]).toString();

    if (decrypted == req.session.timetoken) {
        console.log("loadcircuit: Code accepted.");

        let result = loadFromDatabase(req.session, req.body.linkID);

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
    await client.query("SELECT circuit_json FROM circuit_table WHERE link_id = " + linkID + ";").then(res => {
        if (res.rowCount > 0) {
            let circuitJSON = {linkID: linkID, circuitJSON: res.rows[0]['circuit_json']};
            session.circuitJSONArray.push(circuitJSON);
            circuitLoadedCorrectly = true;
        }
    }).catch(err => {
        //console.log(err.stack);
        console.log("Failed to retrieve circuit.");
    }).finally(() => {

    });

    if (circuitLoadedCorrectly) {
        // Increment the number of times accessed by 1.
        await client.query("UPDATE circuit_table SET times_accessed = times_accessed + 1 WHERE link_id = " + linkID + ";").then(res => {
            console.log("Incremented access count.")
        }).catch(err => {
            //console.log(err.stack);
            console.log("Failed to increment access count.");
        }).finally(() => {

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
    await client.query("INSERT INTO circuit_table (user_ip, date_added, times_accessed, circuit_json) VALUES ('" + user_IP + "', current_timestamp, 0, '" + circuitJSON + "') RETURNING link_id").then(res => {
        console.log("Inserted circuit successfully with link_id: " + res.rows[0]['link_id']);
        session.link_ID = res.rows[0]['link_id'];
    }).catch(err => {
        //console.log(err.stack);
        console.log("Failed to insert circuit.");
    }).finally(() => {
        session.savingCircuit = false;
        session.save();
    });
}

// Make sure it has all the JSON fields it should.
// Make sure it is not empty.
// Make sure it is not ridiculously large.
function validateCircuit(circuitJSON)
{
    let circuitData = JSON.parse(circuitJSON);
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

            if (circuitJSON.length > 100000)
                return false;

            return true;
        }
        console.log("No version 1");
        // TODO: Add future version handling here.
    }
    console.log("No version");
    return false;
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

async function createDatabaseAndTableIfNotExist() {
    let client;
    let db_exists = true;

    if (process.env.NODE_ENV == 'local') {
        client = new pg.Client();
        client.connect();

        // Check if the circuit_db database exists
        await client.query("SELECT datname FROM pg_catalog.pg_database WHERE datname=\'circuit_db\';").then(res => {
            //const fields = res.fields.map(field => field.name);
            //console.log("Database exists.");
            //console.log(res.rowCount);
            if (res.rowCount > 0) {
                console.log("Database exists.")
                db_exists = true;
            } else {
                console.log("Database does not exist.")
                db_exists = false;
            }

        }).catch(err => {
            //console.log(err.stack);
            console.log("Error checking if database exists.");
        }).finally(() => {

        });

        // If the database doesn't exist, create it.
        if (!db_exists) {
            await client.query('CREATE DATABASE circuit_db').then(res => {
                console.log("Created the database successfully.");
                db_exists = true;
            }).catch(err => {
                console.log("Couldn't create the database.");
            }).finally(() => {

            });
        }

        // Disconnect from the database.
        client.end();
    }

    // Now connect to the database and check to see if it has the required data table.
    if (db_exists) {
        // Connect to the circuit_db database.
        console.log("Connecting to database.");
        client = process.env.NODE_ENV == 'local' ? new pg.Client({database: "circuit_db"}) : new pg.Client(
            {
                user: process.env.REMOTE_PGUSER,
                password: process.env.REMOTE_PGPASSWORD,
                database:  process.env.REMOTE_PGDATABASE,
                port: process.env.REMOTE_PGPORT,
                host: process.env.REMOTE_PGHOST,
                ssl: {
                    rejectUnauthorized: false
                }
            });
        client.connect();

        await client.query("CREATE TABLE circuit_table (link_id SERIAL PRIMARY KEY, user_IP VARCHAR(255), date_added TIMESTAMPTZ, times_accessed BIGINT, circuit_json TEXT);").then(res => {
            console.log("Table created successfully.")
        }).catch(err => {
            //console.log(err.stack);
            console.log("Table creation failed. (It probably already exists.)");
        }).finally(() => {

        });

        client.end();
    }
}