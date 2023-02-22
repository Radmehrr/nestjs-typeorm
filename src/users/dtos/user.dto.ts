import { Expose, Exclude } from 'class-transformer';

// expose: namayesh dadan
// exclude: hazf kardan

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
