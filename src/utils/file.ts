import { readFile, writeFile } from 'fs/promises'

export const readFileAsync = async (filePath: string) : Promise<string> => {
  try {
    const data: string = await readFile(filePath, 'utf8')
    return data
  } catch (error: any) {
    console.error(`Error when readying file asynchronously: ${error.message}`)
    throw error
  }
}

export const writeFileAsync = async (filePath: string, content: string) : Promise<void> => {
  try {
    await writeFile(filePath, content, 'utf8')
    console.log(`successfully wrote to ${filePath}`)
  } catch (error: any) {
    console.error(`Error when writing file asynchronously: ${error.message}`)
    throw error
  }
}