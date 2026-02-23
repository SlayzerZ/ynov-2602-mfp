import { map } from "./mapping"

describe("Mapping Array", () => {
    const numbers = [1, 2, 3, 4, 5];
    it("should doubled the numbers", () => {
        const toDouble = jest.fn(n => n * 2)
        const doubled = map(numbers, toDouble);
        expect(doubled).toEqual([2, 4, 6, 8, 10])
        expect(toDouble).toHaveBeenCalledTimes(numbers.length);
        numbers.forEach((n, i) => {
            expect(toDouble).toHaveBeenNthCalledWith(i + 1, n);
        });
    })

    it("should add N° to the numbers", () => {
        const toNum = jest.fn(n => `N°${n}`)
        const newNumbers = map(numbers, toNum);
        expect(newNumbers).toEqual(["N°1", "N°2", "N°3", "N°4", "N°5"])
        expect(toNum).toHaveBeenCalledTimes(numbers.length);
        numbers.forEach((n, i) => {
            expect(toNum).toHaveBeenNthCalledWith(i + 1, n);
        });
    })
})