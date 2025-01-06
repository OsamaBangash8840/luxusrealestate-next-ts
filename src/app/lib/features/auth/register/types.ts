export interface IRegisterUser {
    name:string;
    email: string;
    password: string;
}

export interface IData {
    registerUser : IRegisterUser;
    token: string;
}

export interface IRegisterUserResponse{
    success:boolean;
    data : IData;
    error : string | null;
}

export interface IRegisterRequestBody {
    name: string;
    email: string;
    password: string;
}
