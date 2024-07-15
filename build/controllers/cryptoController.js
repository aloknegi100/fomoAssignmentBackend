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
exports.getPriceHistory = exports.getCryptoList = exports.saveCryptoData = void 0;
const Crypto_1 = require("../models/Crypto");
const axiosFactory_1 = require("../services/axiosFactory");
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
const saveCryptoData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const crypto = req.query.crypto;
        if (!crypto) {
            return res.status(400).json({ message: 'Crypto query parameter is required' });
        }
        const cryptoData = yield (0, axiosFactory_1.axiosFactory)("get", `${process.env.COINGECKO_API}/coins/${crypto}`);
        const filteredCryptoData = filterCryptoData(cryptoData);
        let existingCrypto = yield Crypto_1.Crypto.findOne({ id: filteredCryptoData.id });
        if (existingCrypto) {
            // const existingEntry = existingCrypto.market_data.find((entry: any) => entry.last_updated === filteredCryptoData.last_updated);
            if (1) {
                existingCrypto.market_data.unshift(filteredCryptoData.market_data[0]);
                if (existingCrypto.market_data.length > 20) {
                    existingCrypto.market_data = existingCrypto.market_data.slice(0, 20);
                }
                existingCrypto.last_updated = filteredCryptoData.last_updated;
                yield existingCrypto.save();
            }
            else {
                console.log("call cancel because sane timestamp");
            }
        }
        else {
            let document = yield Crypto_1.Crypto.create(filteredCryptoData);
            console.log("document");
            return res.status(200).json({ message: 'Cryptocurrency data saved successfully', data: document });
        }
        console.log("existingCrypto");
        res.status(200).json({ message: 'Cryptocurrency data saved successfully', data: existingCrypto });
    }
    catch (error) {
        console.error('Error saving cryptocurrency data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.saveCryptoData = saveCryptoData;
const getCryptoList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cryptoList = yield (0, axiosFactory_1.axiosFactory)("get", `${process.env.COINGECKO_API}/coins/markets?vs_currency=usd`);
        res.status(200).json({ message: 'Cryptocurrency List fetch', data: cryptoList });
    }
    catch (error) {
        console.error('Error saving cryptocurrency data:', error);
        res.status(500).json({ message: (error === null || error === void 0 ? void 0 : error.message) || 'Internal server error' });
    }
});
exports.getCryptoList = getCryptoList;
const getPriceHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const crypto = req.query.crypto;
        if (!crypto) {
            return res.status(400).json({ message: 'Crypto query parameter is required' });
        }
        let priceHistory = yield (0, axiosFactory_1.axiosFactory)("get", `${process.env.COINGECKO_API}/coins/${crypto}/market_chart?vs_currency=usd&days=120`);
        let ans = (_a = priceHistory === null || priceHistory === void 0 ? void 0 : priceHistory.prices) === null || _a === void 0 ? void 0 : _a.slice(110, 120);
        console.log(ans);
        res.status(200).json({ message: 'Cryptocurrency List fetch', data: ans });
    }
    catch (error) {
        console.error('Error saving cryptocurrency data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getPriceHistory = getPriceHistory;
