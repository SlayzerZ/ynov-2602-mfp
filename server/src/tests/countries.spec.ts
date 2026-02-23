import { fetchCountriesByPrefix, CountriesResponse } from './countries';

// Mock global fetch
global.fetch = jest.fn();

describe('fetchCountriesByPrefix', () => {
    const mockResponse: CountriesResponse = {
        status: 'OK',
        total: 3,
        data: {
            US: { country: 'United States of America', region: 'North America' },
            GB: { country: 'United Kingdom', region: 'Europe' },
            FR: { country: 'France', region: 'Europe' },
        },
    };

    beforeEach(() => {
        (fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockResponse),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('filters countries starting with the given prefix', async () => {
        const result = await fetchCountriesByPrefix('Uni');

        expect(result).toEqual([
            { code: 'US', name: 'United States of America' },
            { code: 'GB', name: 'United Kingdom' },
        ]);
    });

    it('is case-insensitive', async () => {
        const result = await fetchCountriesByPrefix('fr');

        expect(result).toEqual([
            { code: 'FR', name: 'France' }
        ]);
    });

    it('returns empty array if no match', async () => {
        const result = await fetchCountriesByPrefix('Z');
        expect(result).toEqual([]);
    });
});