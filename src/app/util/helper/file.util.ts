export class FileUtil {
    static fullFileName(selectedFile: any) {
        return selectedFile.name
    }

    static fileNameWithoutExtension(selectedFile: any) {
        const name = FileUtil.fullFileName(selectedFile);
        return name.slice(0, name.lastIndexOf('.'));
    }

    static fileExtension(selectedFile: any) {
        const name = FileUtil.fullFileName(selectedFile);
        return name.slice(name.lastIndexOf('.') + 1);
    }
}