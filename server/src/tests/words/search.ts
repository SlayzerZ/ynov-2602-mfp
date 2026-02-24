const fs = require("fs").promises;

export function countWords(text: string, word: string): number {
    const parse = text.toLowerCase()
    let nbWord = parse.split(word.toLowerCase()).length - 1
    return nbWord
}

export async function countWordsInFile(filepath: string, word: string, encoding: string = "utf8"): Promise<number> {
    const data = await fs.readFile(filepath, encoding);
    return countWords(Buffer.from(data).toString(), word);
};