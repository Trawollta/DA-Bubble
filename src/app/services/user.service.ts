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
      isActive: user.isActive, //Alex 27.2.24--changed from status to active because it is only a boolean
      img: user.img
    };
  }
}
