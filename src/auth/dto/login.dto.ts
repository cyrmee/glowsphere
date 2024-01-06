import * as classValidator from 'class-validator';

export class LoginDto {
  @classValidator.IsEmail()
  @classValidator.IsNotEmpty()
  email: string;

  @classValidator.IsString()
  @classValidator.IsNotEmpty()
  password: string;
}
