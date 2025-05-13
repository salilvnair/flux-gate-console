export class NumberUtil {
    static isNumber(value:any) {
        return !isNaN(+value);
    }
}