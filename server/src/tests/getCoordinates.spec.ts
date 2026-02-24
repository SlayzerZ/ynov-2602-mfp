import axios from "axios";
import { getCoordinatesFromSearch } from "../utils/getCoordinatesFromSearch"

jest.mock('axios')

describe("Get coordinates", () => {
    const fake = [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                2.347,
                48.859
            ]
        }
    },]

    beforeEach(() => {
        (axios.get as jest.Mock).mockResolvedValue({
            data: { features: fake },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the good coordinates", async () => {
        // (axios.get as jest.Mock).mockResolvedValue(fake)
        const coords = await getCoordinatesFromSearch("dst")
        console.log(coords)
        expect(coords.lng).toBeCloseTo(2.347, 2)
        expect(coords.lat).toBeCloseTo(48.859, 2)
    })

})
