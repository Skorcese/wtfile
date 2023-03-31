import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { OctokitModule } from 'nestjs-octokit';
import { QuestionModelDefinition } from 'src/question/question.schema';
import { GitHubService } from './git-hub.service';
import { RepoParserModule } from './repo-parser/repo-parser.module';

@Module({
  imports: [
    OctokitModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        octokitOptions: {
          auth: configService.get<string>('GITHUB_AUTH_TOKEN'),
        },
      }),
    }),
    RepoParserModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([QuestionModelDefinition]),
  ],
  providers: [GitHubService],
})
export class GitHubModule {}
