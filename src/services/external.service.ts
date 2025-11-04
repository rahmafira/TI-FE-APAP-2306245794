import axios from "axios";

// 1. Definisikan interface untuk satu objek provinsi dari API
interface RawProvince {
    id: string;
    name: string;
}

// 2. Interface untuk hasil akhir yang kita inginkan
export interface Province {
    id: string;
    name: string;
}

export const ExternalService = {
    getProvinces: async (): Promise<Province[]> => {
        try {
            // 3. Beri tahu axios tipe data yang diharapkan
            const response = await axios.get<RawProvince[]>('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
            
            // 4. Ganti 'any' dengan 'RawProvince' yang sudah kita definisikan
            return response.data.map((p: RawProvince) => ({ id: p.id, name: p.name }));
        } catch (error) {
            console.error("Failed to fetch provinces:", error);
            return [];
        }
    }
}