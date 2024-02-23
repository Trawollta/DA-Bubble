import { Injectable } from '@angular/core';
import { User } from 'app/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getCleanJson(user: User): {} {
    return {
      name: user.name,
      email: user.email,
      status: user.status,
      img: user.img
    };
  }
}
