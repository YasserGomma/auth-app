import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: any;
  let mockJwtService: any;
  let bcrypt: any;

  // Helper to create a mock mongoose query chain
  const createMockQuery = (result: any) => ({
    maxTimeMS: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
  });

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    bcrypt = require('bcrypt');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should successfully register a new user', async () => {
      mockUserModel.findOne.mockReturnValue(createMockQuery(null));
      mockUserModel.create.mockResolvedValue({ _id: '123', email: 'test@example.com' });

      const result = await service.signup({
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      });

      expect(result).toEqual({
        message: 'User created successfully',
        userId: '123',
      });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
      expect(mockUserModel.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserModel.findOne.mockReturnValue(
        createMockQuery({ email: 'test@example.com' }),
      );

      await expect(
        service.signup({
          email: 'test@example.com',
          name: 'Test User',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('signin', () => {
    it('should return a JWT token for valid credentials', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed-password',
      };
      mockUserModel.findOne.mockReturnValue(createMockQuery(mockUser));

      const result = await service.signin({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result).toEqual({ token: 'mock-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: '123',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockUserModel.findOne.mockReturnValue(createMockQuery(null));

      await expect(
        service.signin({
          email: 'wrong@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        password: 'hashed-password',
      };
      mockUserModel.findOne.mockReturnValue(createMockQuery(mockUser));
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        service.signin({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
