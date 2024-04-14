const fs = require('fs')
const File = require('../models/File')
const config = require('config')
const path = require('path')

class FileService {

    createDir(req, file) {
        const filePath = this.getPath(req, file)
        return new Promise(((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message: 'File was created'})
                } else {
                    return reject({message: "File already exist"})
                }
            } catch (e) {
                return reject({message: 'File error'})
            }
        }))
    }

    deleteFile(req, file) {
        const path = this.getPath(req, file)
        if (file.type === 'dir') {
            fs.rmdirSync(path)
        } else {
            fs.unlinkSync(path)
        }
    }

    getPath(req, file) {
        return req.filePath + '/' + file.user + '/' + file.path
    }

    async buildFolderStructure(userFolderPath, currentPath = '', parentIdPath = [null]) {
        const folderContents = fs.readdirSync(userFolderPath)
        const folderStructure = []
        for (const dirName of folderContents) {
            const contentPath = path.join(userFolderPath, dirName)
            const stats = fs.statSync(contentPath)
            if (stats.isDirectory()) {
                const fullPath = path.join(currentPath, dirName)
                const id = await this.getFolderId(fullPath)
                const idPath = [...parentIdPath, id]
                const childs = await this.buildFolderStructure(contentPath, fullPath, idPath)
                const folderInfo = {
                    _id: id,
                    name: dirName,
                    path: fullPath,
                    idPath: idPath,
                    childs: childs
                };
                folderStructure.push(folderInfo)
            }
        }
        return folderStructure
    }
    

    async getFolderId(folderPath) {
        try {
            const folder = await File.findOne({ path: folderPath })
            return folder ? folder._id : null
        } catch (e) {
            console.error('Failed to get folder ID:', e)
            return null
        }
    }
}


module.exports = new FileService()
