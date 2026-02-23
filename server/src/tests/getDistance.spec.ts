import { getDistance } from '../utils/getDistance';

describe('getDistance', () => {
    it('should return 0 when both points are the same', () => {
        const point = { lat: 48.8566, lng: 2.3522 };
        const distance = getDistance(point, point);
        expect(distance).toBeCloseTo(0, 5);
    });

    it('should calculate distance between Paris and London', () => {
        const paris = { lat: 48.8566, lng: 2.3522 };
        const london = { lat: 51.5074, lng: -0.1278 };

        const distance = getDistance(paris, london);

        expect(Math.trunc(distance)).toBeCloseTo(343, 0);
    });

    it('should calculate distance between New York and Los Angeles', () => {
        const ny = { lat: 40.7128, lng: -74.006 };
        const la = { lat: 34.0522, lng: -118.2437 };

        const distance = getDistance(ny, la);

        expect(distance).toBeCloseTo(3936, 0);
    });
});