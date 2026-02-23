export interface CountryData {
    country: string;
    region: string;
}

export interface CountriesResponse {
    status: string;
    total: number;
    data: Record<string, CountryData>;
}

// Function to fetch and filter countries by prefix
export async function fetchCountriesByPrefix(prefix: string) {
    const lowerPrefix = prefix.toLowerCase();

    const res = await fetch('https://api.first.org/data/v1/countries?limit=1000');
    const data: CountriesResponse = await res.json();

    const filtered = Object.entries(data.data)
        .filter(([_, value]) => value.country.toLowerCase().startsWith(lowerPrefix));

    return filtered.map(([code, value]) => ({ code, name: value.country }));
}