import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  private async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId },
        { expiresIn: '1h' } // 5 minutes
      ),
      this.jwtService.signAsync(
        { userId },
        { expiresIn: '24h' } // 1 hour
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, roleIds } = registerDto;

    const userExists = await this.usersRepository.findOne({ where: { email } });
    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    // Find all roles
    const roles = await Promise.all(
      roleIds.map(async (roleId) => {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) {
          throw new NotFoundException(`Role with ID ${roleId} not found`);
        }
        return role;
      })
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      roles,
    });
    
    const savedUser = await this.usersRepository.save(user);
    const tokens = await this.generateTokens(savedUser.id);
    
    // Save refresh token
    await this.usersRepository.update(savedUser.id, {
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id);
    
    // Save refresh token
    await this.usersRepository.update(user.id, {
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken);
      const user = await this.usersRepository.findOne({ where: { id: decoded.userId } });

      if (!user || user.refreshToken !== refreshTokenDto.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.id);
      
      // Update refresh token
      await this.usersRepository.update(user.id, {
        refreshToken: tokens.refreshToken,
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersRepository.update(userId, {
      refreshToken: null,
    });
    return { message: 'Logged out successfully' };
  }
}