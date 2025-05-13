
export class URLUtil {
    static includesPath(path:string) {
        let url = window.location.href
        return url.includes(path)
    }

    
}