import { Request, Response } from 'express';
import { Crypto } from '../models/Crypto';
import { axiosFactory } from '../services/axiosFactory';
import { ICrypto } from '../types/Crypto';

// Helper function to filter and map cryptoData
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

// Function to save cryptocurrency data
export const saveCryptoData = async (req: Request, res: Response) => {
    try {
        const crypto = req.query.crypto;
        
        if (!crypto) {
            return res.status(400).json({ message: 'Crypto query parameter is required' });
        }

        const cryptoData = await axiosFactory("get", `https://api.coingecko.com/api/v3/coins/${crypto}`);

        // Extract only the fields defined in your ICrypto interface
        const filteredCryptoData = filterCryptoData(cryptoData);

        // Check if cryptocurrency with the same ID already exists
        let existingCrypto = await Crypto.findOne({ id: filteredCryptoData.id });

        if (existingCrypto) {
            // If exists, update the market_data array to keep the latest 20 entries
            existingCrypto.market_data.push(filteredCryptoData.market_data[0]);
            if (existingCrypto.market_data.length > 20) {
                existingCrypto.market_data = existingCrypto.market_data.slice(-20);
            }
            existingCrypto.last_updated = filteredCryptoData.last_updated;
            await existingCrypto.save();
        } else {
            // If not exists, create a new record
            await Crypto.create(filteredCryptoData);
        }

        res.status(200).json({ message: 'Cryptocurrency data saved successfully', data:existingCrypto });
    } catch (error) {
        console.error('Error saving cryptocurrency data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
