import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RolesModule } from './roles/roles.module';
import { CountriesModule } from './countries/countries.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { SlidersModule } from './sliders/sliders.module';
import { CurrencyModule } from './currency/currency.module';
import { CuisinesModule } from './cuisines/cuisines.module';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...((configService.get('DATABASE_URL')
          ? {
              type: 'postgres',
              url: configService.get('DATABASE_URL'),
              ssl: {
                rejectUnauthorized: false
              }
            }
          : {
              type: 'postgres',
              host: configService.get('DB_HOST'),
              port: configService.get('DB_PORT'),
              username: configService.get('DB_USERNAME'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_DATABASE')
            })),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production'
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    DashboardModule,
    RolesModule,
    CountriesModule,
    UsersModule,
    CategoriesModule,
    RestaurantsModule,
    NewsletterModule,
    SlidersModule,
    CurrencyModule,
    CuisinesModule,
  ],
})
export class AppModule {}