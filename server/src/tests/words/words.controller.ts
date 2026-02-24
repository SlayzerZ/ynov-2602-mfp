import { Router } from 'express'
import { countWordsInFile, countWords } from './search'
/**
 * Nous créeons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const WordsController = Router()

WordsController.get('/:word', async (req, res) => {
    const search = String(req.params.word)

    if (search.length == 0) {
        // throw new exception('ID non valide')
    }

    const nb = await countWordsInFile("./src/tests/words/text.txt", search)
    if (!nb) {
        // throw new Exception('Animal introuvable')
    }

    return res
        .status(200)
        .json({ result: nb })
})

WordsController.post('/', (req, res) => {
    const textForm = req.body

    const nb = countWords(textForm.text, textForm.search)

    return res
        .status(200)
        .json({ result: nb })
})

export { WordsController }