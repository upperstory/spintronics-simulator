const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const path = require('path')

let crypto;
try {
    crypto = require('crypto');
} catch (err) {
    console.log('crypto support is disabled!');
}

const PORT = process.env.PORT || 5000

// Maximum age of sessions. What happens when cookie expires, but webpage still has old code?
const oneDay = 1000 * 60 * 60 * 24;

const app = express();

// cookie parser middleware
app.use(cookieParser());
app.use(express.json());

// For CORS
if (process.env.NODE_ENV == "local") {
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
}

// session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized:true,
    cookie: {
        maxAge: oneDay,
        secure: /*process.env.NODE_ENV == "local" ? true : false*/false,
        httpOnly: false,
        sameSite: 'Lax'
    },
    resave: false
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.get('/', (req, res) => res.render('pages/index'));

// Endpoints
app.get('/getcode', function(req, res){

    console.log('Server started up.');
    console.log("Cookies:");
    console.log(req.cookies);
    console.log("Header:");
    console.log(req.header);
    if (req.session.timetoken) {
        // Already have a code in this session - just return the same code
        res.json({code: req.session.encrypted});
    } else {
        // Create a session token based on the current time
        req.session.timetoken = process.hrtime()[1];
        req.session.iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(process.env.CIPHER_ALGORITHM, process.env.CIPHER_SECRET, req.session.iv);
        req.session.encrypted = Buffer.concat([cipher.update(req.session.timetoken.toString()), cipher.final()]).toString('base64');

        res.json({code: req.session.encrypted});
    }
});

app.post('/submitcircuit', function(req, res){
    console.log("Time token: " + req.session.timetoken);
    /*const decipher = crypto.createDecipheriv(process.env.CIPHER_ALGORITHM, process.env.CIPHER_SECRET, req.session.iv);
    let decrypted = Buffer.concat([decipher.update(Buffer.from(req.body.code, 'base64')), decipher.final()]).toString();
    console.log(decrypted + " " + req.session.timetoken)
    if (decrypted == req.session.timetoken)
    {
        // The code matched. Now we can continue.
        console.log("Code matched.")
        console.log(req.body['circuit']);
    }
    else
    {
        console.log("The code did not match.")
    }*/
    res.sendStatus(123);
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
