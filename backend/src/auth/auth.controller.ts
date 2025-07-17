import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SignUpDto, SignInDto } from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User successfully registered' })
  @ApiBadRequestResponse({
    description: 'Invalid input or email already exists',
  })
  @ApiBody({ type: SignUpDto, description: 'User registration data' })
  async signup(@Body() signUpDto: SignUpDto) {
    this.logger.log(`[SIGNUP] Attempt for email: ${signUpDto.email}`);

    try {
      const result = await this.authService.signup(signUpDto);
      this.logger.log(`[SIGNUP] Success for email: ${signUpDto.email}`);
      return result;
    } catch (error) {
      const errMsg =
        error?.message || JSON.stringify(error) || 'Unknown signup error';
      this.logger.error(`[SIGNUP] Failed for email: ${signUpDto.email}`);
      this.logger.error(`[SIGNUP] Error: ${errMsg}`, error.stack);
      throw new HttpException(errMsg, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signin')
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: SignInDto, description: 'User credentials' })
  async signin(@Body() signInDto: SignInDto) {
    this.logger.log(`[SIGNIN] Attempt for email: ${signInDto.email}`);

    try {
      const result = await this.authService.signin(signInDto);
      this.logger.log(`[SIGNIN] Success for email: ${signInDto.email}`);
      return result;
    } catch (error) {
      const errMsg =
        error?.message || JSON.stringify(error) || 'Unknown signin error';
      this.logger.error(`[SIGNIN] Failed for email: ${signInDto.email}`);
      this.logger.error(`[SIGNIN] Error: ${errMsg}`, error.stack);
      throw new HttpException(errMsg, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getProfile(@Request() req) {
    this.logger.log(`[PROFILE] Fetching for user ID: ${req.user?.sub}`);
    return req.user;
  }

  @Get('health')
  getHealth(): string {
    this.logger.log('[HEALTH] Health check requested');
    return 'OK';
  }
}
