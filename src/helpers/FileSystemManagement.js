var RNFS = require('react-native-fs');
var path;
export const writeFile = (fileName, content) => {
    path = RNFS.DocumentDirectoryPath + "/" + fileName;
    RNFS.writeFile(path, content, 'utf8')
        .then((success) => {
            console.log('FILE WRITTEN!');
        })
        .catch((err) => {
            console.log(err.message);
        });
}

export const readFile = (fileName) => {
    path = RNFS.DocumentDirectoryPath + "/" + fileName;
    return RNFS.readFile(path, 'utf8');
}

export const deleteFile = (fileName) => {
    path = RNFS.DocumentDirectoryPath + '/' + fileName;
    return RNFS.unlink(path)
        .then(() => {
            console.log('FILE DELETED');
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
            console.log(err.message);
        });
}

