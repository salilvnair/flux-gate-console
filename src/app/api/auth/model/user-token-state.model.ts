
export interface UserTokenState {
    idToken: string
    validToken: boolean
    expiresIn: number
    userInfo: UserInfo
}


export interface UserInfo {
    username: string
    firstName: string
    lastName: string
    roles: RoleInfo[]
}

export interface RoleInfo {
    name: UserRole,
    id: number
}

export enum UserRole {
    USER="USER",
    TESTER="TESTER",
    DEVELOPER="DEVELOPER",
}