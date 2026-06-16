import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PhanHeModule } from './modules/phan-he/phan-he.module';
import { ChucNangModule } from './modules/chuc-nang/chuc-nang.module';
import { VaiTroModule } from './modules/vai-tro/vai-tro.module';
import { VaiTroChucNangModule } from './modules/vai-tro-chuc-nang/vai-tro-chuc-nang.module';
import { NguoiDungVaiTroModule } from './modules/nguoi-dung-vai-tro/nguoi-dung-vai-tro.module';
import { PhanQuyenModule } from './modules/phan-quyen/phan-quyen.module';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PhanHeModule,
    ChucNangModule,
    VaiTroModule,
    VaiTroChucNangModule,
    NguoiDungVaiTroModule,
    PhanQuyenModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
