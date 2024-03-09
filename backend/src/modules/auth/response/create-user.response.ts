export class CreateUserResponse {
  // The name of the user.
  name: string;

  // The email of the user.
  email: string;

  // The password of the user.
  password: string;

  // The phone number of the user.
  phone: string;

  // if the user is active or not.
  is_active?: boolean;

  // The role of the user.
  level?: string;

  access_token: string;
}
