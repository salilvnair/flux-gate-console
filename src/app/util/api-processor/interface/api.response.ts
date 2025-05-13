export interface ApiResponse<T> {
    response?:T,
    hasError?:boolean,
    error?: any,
    request:any,
    inputParamsMap: { [key:string]:any },
    args?: any[]
}