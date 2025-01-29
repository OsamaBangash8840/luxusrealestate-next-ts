export interface ILoginUser {
    email: string;
    password: string;
}

export interface IData {
    message: string;
    loginUser: ILoginUser;
    token: string;
}

export interface IUserLoginResponse {
    success: boolean;
    data: IData;
    error: string | null;
}

export interface IUserRequestBody {
    email: string;
    password: string;
}
