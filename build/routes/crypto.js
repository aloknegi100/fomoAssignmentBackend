"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cryptoController_1 = require("../controllers/cryptoController");
const CryptoRouter = (0, express_1.Router)();
CryptoRouter.get('/saveCryptoData', cryptoController_1.saveCryptoData);
CryptoRouter.get('/getCryptoList', cryptoController_1.getCryptoList);
CryptoRouter.get('/getPriceHistory', cryptoController_1.getPriceHistory);
exports.default = CryptoRouter;
