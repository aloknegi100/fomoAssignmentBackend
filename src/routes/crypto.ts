import { Router } from "express"
import { getCryptoList, getPriceHistory, saveCryptoData } from "../controllers/cryptoController"

const CryptoRouter=Router()

CryptoRouter.get('/saveCryptoData',saveCryptoData)
CryptoRouter.get('/getCryptoList',getCryptoList)
CryptoRouter.get('/getPriceHistory',getPriceHistory)




export default CryptoRouter