import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/user.model.js"
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const connectToDb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/user-registry', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4,
        });
        console.log('Connected to DB');
    } catch (error) {
        console.log(error);
    }
}

connectToDb();

app.get('/', (req, res) => {
    res.send("HEllo")
});

app.post('/api/register', async (req, res) => {
    const { body: { name, email, password: _password } } = req;
    try {
        const password = await bcrypt.hash(_password, 10);
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(200).json({ status: 'ok', message: "Register Successful" });
    }
    catch ({ code }) {
        res.status(500).json({ status: 'error', code });
    }
});

app.post('/api/login', async (req, res) => {
    const { body: { email, password } } = req;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(500).json({ status: 'error' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        const token = jwt.sign({ name: user.name, email: user.email }, 'secret');
        //secret is the client secret which should be a lot more powerful
        res.status(200).json({ status: 'ok', userToken: token });
    }
    else {
        res.status(500).json({ status: 'error', message: 'password is incorrect' })
    }
})

app.get('/api/quote', async (req, res) => {
    const accessToken = req.headers['x-access-token'];
    if (accessToken) {
        const { email } = jwt.verify(accessToken, 'secret');
        const user = await User.findOne({ email });
        res.status(200).json({ quote: user.quote });
    } else {
        res.status(404).send({ status: "error", error: 'invalid access token' });
    }
});

app.post('/api/quote', async (req, res) => {
    const accessToken = req.headers['x-access-token'];
    try {
        const { email } = jwt.verify(accessToken, 'secret');
        await User.updateOne({ email }, {
            $set: {
                quote: req.body.quote
            }
        });
        res.status(200).json({ status: "ok" });
    } catch (error) {
        res.status(500).json({ status: "error", error });
    }
});

app.listen(port, () => {
    console.log("Server Started at port", port)
})
