import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// TODO: Create and implement UsersService class
// import { UsersService } from './users.service';
// TODO: Create and implement UsersController class
// import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [],
  controllers: [],
  exports: [],
})
export class UsersModule {}