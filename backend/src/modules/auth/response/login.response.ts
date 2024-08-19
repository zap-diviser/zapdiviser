import { UserEntity } from "@/modules/user/entities/user.entity";

export default class LoginResponse extends UserEntity {
  access_token: string;
}
