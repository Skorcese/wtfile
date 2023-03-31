import { Module } from '@nestjs/common';
import { RepoParserService } from './repo-parser.service';

@Module({ providers: [RepoParserService], exports: [RepoParserService] })
export class RepoParserModule {}
