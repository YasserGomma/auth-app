import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { SignUpDto, SignInDto } from '../auth/dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(async () => {
    authService = {
      signup: jest.fn(),
      signin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('signup', () => {
    it('should call authService.signup and return the result', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      };
      const expectedResult = {
        message: 'User created successfully',
        userId: '123',
      };

      authService.signup.mockResolvedValue(expectedResult);

      const result = await controller.signup(signUpDto);

      expect(result).toEqual(expectedResult);
      expect(authService.signup).toHaveBeenCalledWith(signUpDto);
    });

    it('should throw HttpException when authService.signup fails', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      };
      const errorMessage = 'Email already exists';

      authService.signup.mockRejectedValue(new Error(errorMessage));

      await expect(controller.signup(signUpDto)).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('signin', () => {
    it('should call authService.signin and return the token', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const expectedResult = { token: 'mock-token' };

      authService.signin.mockResolvedValue(expectedResult);

      const result = await controller.signin(signInDto);

      expect(result).toEqual(expectedResult);
      expect(authService.signin).toHaveBeenCalledWith(signInDto);
    });

    it('should throw HttpException when authService.signin fails', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };
      const errorMessage = 'Invalid credentials';

      authService.signin.mockRejectedValue(new Error(errorMessage));

      await expect(controller.signin(signInDto)).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.UNAUTHORIZED),
      );
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', async () => {
      const mockUser = {
        sub: '123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = await controller.getProfile({ user: mockUser });

      expect(result).toEqual(mockUser);
    });
  });
});