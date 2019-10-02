export class UserController {
  public getUser = (id: string): any => {
    return {
      id,
      address: '123 Main',
      name: 'backend test',
      dob: '2001-10-02T02:52:57.240Z',
      description: 'Described',
      createdAt: '2001-10-02T02:52:57.240Z',
      updatedAt: '2001-10-02T02:52:57.240Z',
    };
  }
}
