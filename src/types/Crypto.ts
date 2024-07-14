
export interface ICrypto {
    id: string;
    symbol: string;
    name: string;
    image: object;
    market_data: object[];
    last_updated: Date;
}
