import fs from 'fs'
import path,{dirname} from 'path'

const unusedFolders = [".git",".github", "node_modules", "public", "src", "test"]

const parseMarkdown = (filePath) => { 
    const file = fs.readFileSync(filePath, 'utf8')
    const lines = file.split('\n')
    const title = lines[0].replace('#', '').trim()
    const link = filePath;

    return {
        title,
        path : link
    }
}

const parseFolders = (folderPath) => { 
    console.log(folderPath)
    const folderpaths = {
        items: [],
        prefixes: []
    };
    const files = fs.readdirSync(folderPath)
    files.forEach(file => {
        const filePath = path.join(folderPath, file)
        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            if (unusedFolders.indexOf(file) === -1) {
                folderpaths.prefixes.push(parseFolders(filePath))
            }
        } else {
            if (file.indexOf('.md') > -1) {
                folderpaths.items.push(parseMarkdown(filePath))
            }
        }
    })


    console.log(folderpaths)

    return folderpaths;
}

const folderpaths = {};

fs.readdirSync(dirname(''), { withFileTypes: true }).forEach(file => { 

    if (file.isDirectory() && !unusedFolders.includes(file.name)) {
        folderpaths[file.name] = {
            path: `/${file.name}`,
            name: file.name,
            chilren: parseFolders(`${file.name}`)
        }
    }
})

fs.writeFile('./index.json', JSON.stringify(folderpaths), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
