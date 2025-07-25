import UserService from '../src/services/userService';
import { User } from '../src/models/userModel';

jest.mock('../src/models/userModel');

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create and save a new user', async () => {
      const userData = { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' };
      const saveMock = jest.fn().mockResolvedValue(userData);
      (User as any).mockImplementation(() => ({ save: saveMock }));

      const result = await userService.createUser(userData);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(userData);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const users = [{ name: 'Bob', email: 'bob@example.com', password: 'pass5678' }];
      (User.find as jest.Mock).mockResolvedValue(users);
      const result = await userService.findAllUsers();
      expect(User.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const user = { name: 'Charlie', email: 'charlie@example.com', password: 'pass9999' };
      (User.findById as jest.Mock).mockResolvedValue(user);
      const result = await userService.findUserById('123');
      expect(User.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const updatedUser = { firstName: 'Dave', lastName: 'Smith', email: 'dave@example.com', password: 'pass0000' };
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);
      const result = await userService.updateUser('456', { firstName: 'Dave' });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('456', { firstName: 'Dave' }, { new: true });
      expect(result).toEqual(updatedUser);
    });
  });
});
