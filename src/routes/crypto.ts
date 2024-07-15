import { Router } from "express"
import { getCryptoList, saveCryptoData } from "../controllers/cryptoController"

const CryptoRouter=Router()

CryptoRouter.get('/saveCryptoData',saveCryptoData)
CryptoRouter.get('/getCryptoList',getCryptoList)


export default CryptoRouter