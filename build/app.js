"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("./routes/crypto"));
const app = (0, express_1.default)();
const port = 3000;
const MONGODB_URI = 'mongodb://localhost:27017/fomoFactory';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.use('/crypto', crypto_1.default);
app.get('/', (req, res) => {
    res.json({
        message: "hello"
    });
});
app.listen(port, () => {
    console.log(`Listenning on port ${port}`);
});
