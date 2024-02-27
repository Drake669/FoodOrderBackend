import { IsEmail, Length } from "class-validator";

export class CustomerSignUpInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;

  @Length(7, 23)
  phone_number: string;
}

export class UpdateCustomerInputs {
  @Length(3, 20)
  first_name: string;

  @Length(3, 20)
  last_name: string;

  @Length(3, 30)
  address: string;
}

export class CustomerLoginInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}
