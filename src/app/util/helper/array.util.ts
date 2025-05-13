export class ArrayUtil {

    static isNull(array: any[]) {
        return !array;
    }

    static isEmpty(array: any[]) {
        return ArrayUtil.isNull(array) || array.length === 0;
    }

    static isNotNull(array: any[]) {
        return !ArrayUtil.isNull(array);
    }

    static isNotEmpty(array: any[]) {
        return !ArrayUtil.isEmpty(array);
    }

    static findIndex(array: any[], property:string, value:any) {
        return array.findIndex(a => a[property] === value);
    }

    static containsProperty(array: any[], property:string, value:any) {
        return ArrayUtil.findIndex(array, property, value) > -1
    }

    static contains(array: string[], value:string) {
        return array.findIndex(a => a === value) > -1
    }

    static removeDuplicateKeys(arrayOfObjects: any[], key: string) {
        const uniqueObjects = [];
        const encounteredKeys: any = {};

        for (const obj of arrayOfObjects) {
            if (!encounteredKeys[obj[key]]) {
                uniqueObjects.push(obj);
                encounteredKeys[obj[key]] = true;
            }
        }
        return uniqueObjects;
    }

}