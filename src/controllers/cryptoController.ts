import { Request, Response } from 'express';
import { Crypto } from '../models/Crypto';
import { axiosFactory } from '../services/axiosFactory';
import { ICrypto } from '../types/Crypto';

const filterCryptoData = (cryptoData: any): ICrypto => {
    const {
        id,
        symbol,
        name,
        image,
        market_data,
        last_updated
    } = cryptoData;

    return {
        id,
        symbol,
        name,
        image,
        market_data: [market_data], 
        last_updated
    };
};

export const saveCryptoData = async (req: Request, res: Response) => { 
    try {
        const crypto = req.query.crypto;
        
        if (!crypto) {
            return res.status(400).json({ message: 'Crypto query parameter is required' });
        }

        const cryptoData = await axiosFactory("get", `${process.env.COINGECKO_API}/coins/${crypto}`);

        const filteredCryptoData = filterCryptoData(cryptoData);

        let existingCrypto = await Crypto.findOne({ id: filteredCryptoData.id });

        if (existingCrypto) {
            // const existingEntry = existingCrypto.market_data.find((entry: any) => entry.last_updated === filteredCryptoData.last_updated);

            if(1)
            {
                existingCrypto.market_data.unshift(filteredCryptoData.market_data[0]);
                if (existingCrypto.market_data.length > 20) {
                    existingCrypto.market_data = existingCrypto.market_data.slice(0, 20);
                }
                existingCrypto.last_updated = filteredCryptoData.last_updated;
                await existingCrypto.save();
            }else{
            console.log("call cancel because sane timestamp");

            }
            
        } else {
            let document=await Crypto.create(filteredCryptoData);
            console.log("document");
            
            return res.status(200).json({ message: 'Cryptocurrency data saved successfully', data:document });
         
        }
        console.log("existingCrypto");


        res.status(200).json({ message: 'Cryptocurrency data saved successfully', data:existingCrypto });
    } catch (error) {
        console.error('Error saving cryptocurrency data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCryptoList=async(req:Request, res: Response)=>{
    
    try {
        const cryptoList = await axiosFactory("get", `${process.env.COINGECKO_API}/coins/markets?vs_currency=usd`);

        res.status(200).json({ message: 'Cryptocurrency List fetch', data:cryptoList });
        
    } catch (error: any) {
        console.error('Error saving cryptocurrency data:', error);
        res.status(500).json({ message: error?.message||'Internal server error' });
    }

}

export const getPriceHistory=async(req:Request, res: Response)=>{
    
    try {
        const crypto = req.query.crypto;
        
        if (!crypto) {
            return res.status(400).json({ message: 'Crypto query parameter is required' });
        }
        let priceHistory:any = await axiosFactory("get", `${process.env.COINGECKO_API}/coins/${crypto}/market_chart?vs_currency=usd&days=120`);
        let ans:[]=priceHistory?.prices?.slice(110,120)
        console.log(ans);
        
        res.status(200).json({ message: 'Cryptocurrency List fetch', data:ans });
        
    } catch (error) {
        console.error('Error saving cryptocurrency data:', error);
        res.status(500).json({ message:'Internal server error' });
    }

}

 