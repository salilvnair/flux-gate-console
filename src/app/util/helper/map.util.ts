export class MapUtil {
    mapObject: { [key:string]:any };

    constructor(mapObject: { [key:string]:any }) {
        this.mapObject = mapObject ? mapObject : {};
    }

    static init(mapObject?: { [key:string]:any }): MapUtil {
        let newMapObject = mapObject ? mapObject : {};
        return new MapUtil(newMapObject);
    }

    static use(mapUtil:MapUtil, mapObject: { [key:string]:any }, merge?: boolean): MapUtil {
        if(merge) {
            mapUtil.mapObject = MapUtil.merge(mapUtil.mapObject, mapObject);
        }
        else {
            mapUtil.mapObject = mapObject;
        }
        return mapUtil;
    }

    static merge(mapObject1: { [key:string]:any }, mapObject2: { [key:string]:any }) {
        let mergedMapObject: any = {};
        for (let key in mapObject1) { mergedMapObject[key] = mapObject1[key]; }
        for (let key in mapObject2) { mergedMapObject[key] = mapObject2[key]; }
        return mergedMapObject;
    }

    add(key:string, value:any) : MapUtil {
        this.mapObject[key] = value;
        return this;
    }

    addIf(key:string, value:any, condition: boolean) : MapUtil {
        if(condition) {
            this.mapObject[key] = value;
        }
        return this;
    }

    addAll(mapObject: { [key:string]:any }) : MapUtil {
        this.mapObject = MapUtil.merge(this.mapObject, mapObject);
        return this;
    }
  
    put(key:string, value:any) {
        return this.mapObject[key] = value;
    }

    putAll(mapObject: { [key:string]:any }) {
        this.mapObject = MapUtil.merge(this.mapObject, mapObject);
    }

    containsValue(value:any) {
        return Object.keys(this.mapObject).findIndex(key => this.mapObject[key] === value) > -1;
    }

    containsKey(key:string): any {
        return this.mapObject.hasOwnProperty(key);
    }

    get(key:string): any {
        if(this.containsKey(key)) {
            return this.mapObject[key];
        }
        return null;
    }

    extractMap() {
        return this.mapObject;
    }

    keys() {
        return Object.keys(this.mapObject);
    }

    values() {
        let mapObjectValues = [];
        Object.keys(this.mapObject).forEach(key => mapObjectValues.push(this.mapObject[key]));
    }

    remove(key: string) {
        try {
            delete this.mapObject[key];
        }
        catch (e) {}
    }

    replace(key: string, value: any) {
        this.mapObject[key] = value;
    }

    clear(nullify?: boolean) {
        this.mapObject = nullify ? null : <any>{};
    }

    isEmpty() {
        return this.size() === 0;
    }

    size() {
        return this.keys().length;
    }
}