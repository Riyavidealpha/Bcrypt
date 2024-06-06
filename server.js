
require('dotenv').config();
const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');



const sequelize = require('./config/database');
const Auth = require('./model/auth');

const saltrounds = 10;
const app = express();


sequelize.sync();

app.use(express.json());
const server = http.createServer(app);
app.use(cors());



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, 'process.env.SECRET', (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
}



// salt rounds bcrypt
bcrypt.genSalt(saltrounds,)

// post method

app.post('/auth', async (req, res) => {
    const { name, password } = req.body;

    try {
        // Hash the password
        bcrypt.genSalt(saltrounds, async (err, salt) => {
            if (err) {
                console.error('Error generating salt:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            bcrypt.hash(password, salt, async (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                try {
                    // Create the user in the database
                    const auth = await Auth.create({
                        name: name,
                        password: hashedPassword,
                    });

                    console.log('New auth created:', auth);

                    // Generate a JWT token
                    const token = jwt.sign({ name: name }, 'process.env.SECRET');

                    // Respond with success message and token
                    res.status(201).json({ message: 'User Created Successfully', token: token });
                } catch (err) {
                    console.error('Error creating auth:', err);
                    res.status(500).json({ message: 'Internal server error' });
                }
            });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});




app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
});


app.get('/heartbeat', (req, res) => {
    res.json({ message: 'Server is alive', timestamp: new Date() });
});
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


