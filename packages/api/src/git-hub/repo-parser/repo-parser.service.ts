import { Injectable } from '@nestjs/common';
import { parse } from 'path';
import { Directory } from '../git-hub.types';

@Injectable()
export class RepoParserService {
  noConfigFilesOrDirs(dir: Directory): boolean {
    return !dir.name.startsWith('.');
  }

  noFilesWithoutExtension(dir: Directory): boolean {
    if (dir.type === 'file') return dir.name.includes('.');
    return true;
  }

  noDirs(dir: Directory) {
    return dir.type !== 'dir';
  }

  noFiles(dir: Directory) {
    return dir.type === 'dir';
  }

  getFileInfo(filename: string): {
    name: string;
    extension: string;
    fullName: string;
  } {
    const { name, ext, base } = parse(filename);

    return {
      name: name,
      extension: ext,
      fullName: base,
    };
  }
}
