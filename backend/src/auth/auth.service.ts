import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async pingDatabase() {
    try {
      this.logger.log('[PING] Checking MongoDB connectivity');
      const result = await this.userModel.db.db.command({ ping: 1 });
      this.logger.log('[PING] MongoDB responded:', JSON.stringify(result));
      return result;
    } catch (error) {
      this.logger.error('[PING] MongoDB ping failed', error.stack);
      throw new InternalServerErrorException('Database is unreachable');
    }
  }

  async signup(dto: { email: string; name: string; password: string }) {
    this.logger.log(`[SIGNUP] Attempting signup for: ${dto.email}`);
    try {
      const exists = await this.userModel
        .findOne({ email: dto.email })
        .maxTimeMS(5000)
        .exec();

      if (exists) {
        this.logger.warn(`[SIGNUP] Email already exists: ${dto.email}`);
        throw new ConflictException('Email already exists');
      }

      const hash = await bcrypt.hash(dto.password, 10);
      this.logger.log(`[SIGNUP] Password hashed for: ${dto.email}`);

      const user = await this.userModel.create({ ...dto, password: hash });
      this.logger.log(`[SIGNUP] User created successfully: ${user.email}`);

      return { message: 'User created successfully', userId: user._id };
    } catch (error) {
      const errMsg = error?.message || 'Unknown signup error';
      if (error.name === 'MongoNetworkError') {
        this.logger.error(`[SIGNUP] Mongo network error: ${errMsg}`, error.stack);
        throw new InternalServerErrorException('Database connection error - please try again');
      }
      this.logger.error(`[SIGNUP] Failed: ${errMsg}`, error.stack);
      throw error;
    }
  }

  async signin(dto: { email: string; password: string }) {
    this.logger.log(`[SIGNIN] Attempting signin for: ${dto.email}`);
    try {
      const user = await this.userModel
        .findOne({ email: dto.email })
        .maxTimeMS(5000)
        .exec();

      if (!user) {
        this.logger.warn(`[SIGNIN] No user found with email: ${dto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`[SIGNIN] Invalid password for: ${dto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const tokenPayload = {
        sub: user._id,
        email: user.email,
        name: user.name,
      };

      const token = this.jwtService.sign(tokenPayload);
      this.logger.log(`[SIGNIN] JWT issued for: ${dto.email}`);

      return { token };
    } catch (error) {
      const errMsg = error?.message || 'Unknown signin error';
      if (error.name === 'MongoNetworkError') {
        this.logger.error(`[SIGNIN] Mongo network error: ${errMsg}`, error.stack);
        throw new InternalServerErrorException('Database connection error - please try again');
      }
      this.logger.error(`[SIGNIN] Failed: ${errMsg}`, error.stack);
      throw error;
    }
  }
}
