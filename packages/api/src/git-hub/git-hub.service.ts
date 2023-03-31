import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LargeNumberLike } from 'crypto';
import { OctokitService } from 'nestjs-octokit';
import { Question, QuestionModel } from 'src/question/question.schema';
import {
  AVOIDED_EXTENSIONS,
  MAX_ACTIVE_QUESTIONS,
  MIN_CONTENT_LENGTH,
  REPOS_PER_PAGE,
  SEARCH_DEPTH,
  SEARCH_QUERY,
} from './git-hub.constants';
import { RepoInfo, File, Directory } from './git-hub.types';
import { RepoParserService } from './repo-parser/repo-parser.service';

@Injectable()
export class GitHubService {
  constructor(
    private readonly octokitService: OctokitService,
    private readonly repoParserService: RepoParserService,
    @InjectModel(Question.name) private readonly questionModel: QuestionModel,
  ) {}

  private shouldRunJob = true;
  private readonly jobName = 'QuestionScrapingJob';

  @Cron(CronExpression.EVERY_10_SECONDS)
  async questionScrapingJob(): Promise<void> {
    try {
      if (!this.shouldRunJob) return;

      const activeQuestionCount = await this.questionModel.count({
        isActive: true,
      });

      if (activeQuestionCount >= MAX_ACTIVE_QUESTIONS) {
        this.shouldRunJob = false;
        return;
      }

      const { content, extension, name } = await this.retrieveFile();

      if (AVOIDED_EXTENSIONS.includes(extension))
        throw Error(`Unwanted extension: ${extension}`);
      if (content.length <= MIN_CONTENT_LENGTH)
        throw Error(`Content too small: ${content}`);

      const question = new this.questionModel({
        correctAnswer: extension,
        content,
        fileName: name,
        isActive: true,
      });
      await question.save();

      Logger.log(
        `${activeQuestionCount + 1}/100 Question saved: { id: ${
          question.id
        }, fileName: ${question.fileName}${question.correctAnswer} }`,
        this.jobName,
      );
    } catch (error) {
      Logger.error(error.message, this.jobName);
    }
  }

  private async retrieveFile(): Promise<File> {
    const searchKeyword = this.getRandomElement(SEARCH_QUERY);
    const { data } = await this.octokitService.rest.search.repos({
      sort: 'stars',
      per_page: REPOS_PER_PAGE,
      q: searchKeyword,
    });

    const octokitResponse = await Promise.all(
      data.items.map(async ({ owner: { login }, name }) => ({
        owner: login,
        repo: name,
        content: await this.getContent(login, name, ''),
      })),
    );

    const reposRoot = octokitResponse.map(({ content, ...rest }) => ({
      ...rest,
      root:
        Array.isArray(content.data) &&
        content.data
          .filter(this.repoParserService.noConfigFilesOrDirs)
          .filter(this.repoParserService.noFilesWithoutExtension),
    }));

    const randomRepo = this.getRandomElement(reposRoot);
    if (!randomRepo)
      throw Error(`No repository found under "${searchKeyword}" keyword.`);
    const randomFile = await this.getRandomFileContentRandomDepth(randomRepo);

    return randomFile;
  }

  private async getRandomFileContentRandomDepth(repoInfo: RepoInfo) {
    const randomDepth = Math.floor(Math.random() * SEARCH_DEPTH);
    return await this.getRandomFileContent(repoInfo, randomDepth);
  }

  private async getRandomFileContent(
    repoInfo: RepoInfo,
    depth = 0,
    previousFind: File = null,
  ): Promise<File & { depth: number }> {
    const { root, owner, repo } = repoInfo;
    Logger.log(`Attempt: ${owner}/${repo} depth: ${depth}`);

    const files = root.filter(this.repoParserService.noDirs);
    const randomFile = this.getRandomElement(files);

    if (!randomFile) {
      if (previousFind) return { depth, ...previousFind };

      const fileFromRoot = await this.getFileFromDirectory(
        repoInfo,
        root,
        previousFind,
        depth,
      );
      if (fileFromRoot) return fileFromRoot;

      console.log({ files, root });
      throw Error(
        `Could not find any file in repository: ${owner}/${repo}, depth: ${depth}`,
      );
    }

    previousFind = await this.extractOutput(owner, repo, randomFile.path);

    if (!depth) {
      return { depth: 0, ...previousFind };
    }

    const dirs = root.filter(this.repoParserService.noFiles);

    return await this.getFileFromDirectory(repoInfo, dirs, previousFind, depth);
  }

  private async getFileFromDirectory(
    repoInfo: RepoInfo,
    dirs: Directory[],
    previousFind: File,
    depth: number,
  ) {
    const { owner, repo } = repoInfo;

    const randomDir = this.getRandomElement(dirs);

    if (!randomDir) return { depth, ...previousFind };

    const newPath = randomDir.path;

    const { data: newContent } = await this.getContent(owner, repo, newPath);
    const newRoot =
      Array.isArray(newContent) &&
      newContent
        .filter(this.repoParserService.noConfigFilesOrDirs)
        .filter(this.repoParserService.noFilesWithoutExtension);

    return await this.getRandomFileContent(
      { ...repoInfo, root: newRoot },
      depth - 1,
    );
  }

  private async getContent(owner, repo, path) {
    try {
      return await this.octokitService.rest.repos.getContent({
        owner,
        repo,
        path,
      });
    } catch (error) {
      throw new Error(
        `${error.message}, owner: ${owner}, repo: ${repo}, path: ${path}`,
      );
    }
  }

  private async extractOutput(owner, repo, path): Promise<File> {
    const { data } = await this.getContent(owner, repo, path);

    const fileName = 'name' in data && data.name;
    const fileInfo = this.repoParserService.getFileInfo(fileName);
    if (!fileInfo.extension) throw Error('Unexpected missing file extension.');
    const content = this.decodeContent('content' in data && data.content);

    return {
      ...fileInfo,
      content,
    };
  }

  private getRandomElement<T>(arr: T[]): T {
    return arr[~~(Math.random() * arr.length)];
  }

  private decodeContent(content: string): string {
    return Buffer.from(content.toString(), 'base64').toString('ascii');
  }
}
