export class UserProfile {
  constructor(
    public firstName: string = '',
    public lastName: string = '',
    public dateOfBirth: string = '',
    public profileImage: File | null | Blob = null
  ) {}
}
