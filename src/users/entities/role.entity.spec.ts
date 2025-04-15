import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from './role.entity';
import { User } from './user.entity';
import { Repository, DataSource } from 'typeorm';

describe('Role Entity', () => {
  let module: TestingModule;
  let roleRepository: Repository<Role>;
  let userRepository: Repository<User>;
  let dataSource: DataSource;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            entities: [Role, User],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Role, User]),
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    roleRepository = dataSource.getRepository(Role);
    userRepository = dataSource.getRepository(User);

    // Clear repositories before each test
    await roleRepository.clear();
    await userRepository.clear();

    await roleRepository.clear();
    await userRepository.clear();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should create a role', async () => {
    const role = new Role();
    role.name = 'ADMIN';
    role.desc = 'Administrator role';
    
    const savedRole = await roleRepository.save(role);
    expect(savedRole.id).toBeDefined();
    expect(savedRole.name).toBe('ADMIN');
  });

  it('should not allow duplicate role names', async () => {
    const role1 = new Role();
    role1.name = 'USER';
    await roleRepository.save(role1);

    const role2 = new Role();
    role2.name = 'USER';
    
    await expect(roleRepository.save(role2)).rejects.toThrow();
  });

  it('should establish many-to-many relationship with users', async () => {
    const role = new Role();
    role.name = 'EDITOR';
    await roleRepository.save(role);

    const user = new User();
    user.email = 'test@example.com';
    user.password = 'password123';
    user.firstName = 'Test';
    user.lastName = 'User';
    user.roles = [role];
    await userRepository.save(user);

    const savedRole = await roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.users', 'users')
      .where('role.id = :id', { id: role.id })
      .getOne();

    expect(savedRole.users).toHaveLength(1);
    expect(savedRole.users[0].email).toBe('test@example.com');
  });
});