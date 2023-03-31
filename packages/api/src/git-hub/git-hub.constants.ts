const textFiles = ['.version', '.txt', '.md', '.readme', '.adoc'];
const images = ['.png', '.jpg', '.svg'];
const executables = ['.bin', '.pkg', '.apkg'];
const libraries = ['.dll'];
const unknown = ['.nodejs14x'];

export const AVOIDED_EXTENSIONS = [
  ...textFiles,
  ...images,
  ...executables,
  ...libraries,
  ...unknown,
];
export const MAX_ACTIVE_QUESTIONS = 100;
export const MIN_CONTENT_LENGTH = 12;
export const REPOS_PER_PAGE = 50;
export const SEARCH_DEPTH = 5;

const languages = [
  'php',
  'dart',
  'haskell',
  'lisp',
  'lua',
  'typescript',
  'javascript',
  'c#',
  'c++',
  'rust',
  'sql',
];
const frameworks = [
  'nest',
  'react',
  'blazor',
  'flutter',
  'swift',
  'express',
  'django',
  'wpf',
  'vue',
];
const concepts = [
  'machine learning',
  'iot',
  'excel',
  'functional',
  'pentest',
  'network',
  'ddd',
  'sap',
  'system',
  'shell',
  'cli',
  'rest',
  'testing',
  'server',
  'generator',
  'todo',
  'website',
  'bot',
  'engine',
  'game',
  'shader',
  'polygon',
  'neural',
  'database',
  'orm',
  'chat',
  'cron',
  'types',
  'ddd',
  'hexagonal',
  'fizzbuzz',
];
export const SEARCH_QUERY = [...languages, ...frameworks, ...concepts];
