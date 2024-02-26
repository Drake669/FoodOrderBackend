import { IsEmail, Length } from "class-validator";

export class CustomerSignUpInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;

  @Length(7, 23)
  phone_number: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}