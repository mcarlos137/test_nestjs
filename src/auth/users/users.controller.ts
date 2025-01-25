import { Controller, Get } from '@nestjs/common';
import { User, UsersService } from './users.service';
import { Observable } from 'rxjs';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll(): Observable<User[]> {
    return this.usersService.findAll();
  }
}
