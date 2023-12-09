import 'express';
import { User } from './path/to/users.entity';

declare module 'express' {
  interface Request {
    currentUser?: User;
  }
}
