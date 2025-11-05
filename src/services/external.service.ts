import axios from "axios";

interface RawProvince {
    id: string;
    name: string;
}

export interface Province {
    id: string;
    name: string;
}

export const ExternalService = {
    getProvinces: async (): Promise<Province[]> => {
        try {
            const response = await axios.get<RawProvince[]>('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');

            return response.data.map((p: RawProvince) => ({ id: p.id, name: p.name }));
        } catch (error) {
            console.error("Failed to fetch provinces:", error);
            return [];
        }
    }
}