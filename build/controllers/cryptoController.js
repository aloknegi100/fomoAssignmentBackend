"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCryptoData = void 0;
const Crypto_1 = require("../models/Crypto");
const axiosFactory_1 = require("../services/axiosFactory");
// Helper function to filter and map cryptoData
const filterCryptoData = (cryptoData) => {
    const { id, symbol, name, image, market_data, last_updated } = cryptoData;
    return {
        id,
        symbol,
        name,
        image,
        market_data: [market_data],
        last_updated
    };
};
// Function to save cryptocurrency data
const saveCryptoData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const crypto = req.query.crypto;
        if (!crypto) {
            return res.status(400).json({ message: 'Crypto query parameter is required' });
        }
        const cryptoData = yield (0, axiosFactory_1.axiosFactory)("get", `https://api.coingecko.com/api/v3/coins/${crypto}`);
        // Extract only the fields defined in your ICrypto interface
        const filteredCryptoData = filterCryptoData(cryptoData);
        // Check if cryptocurrency with the same ID already exists
        let existingCrypto = yield Crypto_1.Crypto.findOne({ id: filteredCryptoData.id });
        if (existingCrypto) {
            // If exists, update the market_data array to keep the latest 20 entries
            existingCrypto.market_data.push(filteredCryptoData.market_data[0]);
            if (existingCrypto.market_data.length > 20) {
                existingCrypto.market_data = existingCrypto.market_data.slice(-20);
            }
            existingCrypto.last_updated = filteredCryptoData.last_updated;
            yield existingCrypto.save();
        }
        else {
            // If not exists, create a new record
            yield Crypto_1.Crypto.create(filteredCryptoData);
        }
        res.status(200).json({ message: 'Cryptocurrency data saved successfully', data: existingCrypto });
    }
    catch (error) {
        console.error('Error saving cryptocurrency data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.saveCryptoData = saveCryptoData;
