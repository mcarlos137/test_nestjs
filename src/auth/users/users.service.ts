import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Role } from 'src/auth/roles/role.enum';

export type User = {
  userId: number
  username: string
  password: string
  roles:  Role[]
};

@Injectable()
export class UsersService {

  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      roles: [Role.User]
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      roles: [Role.User]
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  findAll(): Observable<User[]> {
    return of(this.users);
  }

}