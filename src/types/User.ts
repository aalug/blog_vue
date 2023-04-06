import { UserProfile } from './UserProfile';

export class User {
  constructor(
    public id: number = 0,
    public email: string = '',
    public username: string = '',
    public userProfile: UserProfile = new UserProfile(),
    public isStaff: boolean = false
  ) {}
}
