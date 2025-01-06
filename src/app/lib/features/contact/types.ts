
export interface IPayload {
    name: string;
    email: string;
    message: string;
    mobile: string;
  }

export interface IFormEnquiryPayload{
    error : false;
    success : true;
    data : {
        quoteRequest: IPayload;
    }
}