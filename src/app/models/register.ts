export class Register {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;

  constructor(
    firstName: string = '',
    lastName: string = '',
    birthDate: string = '',
    email: string = '',
    password: string = ''
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.email = email;
    this.password = password;
  }
}
