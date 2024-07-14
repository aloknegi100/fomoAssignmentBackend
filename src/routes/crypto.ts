import { Router } from "express"
import { saveCryptoData } from "../controllers/cryptoController"

const CryptoRouter=Router()

CryptoRouter.get('/saveCryptoData',saveCryptoData)

export default CryptoRouter