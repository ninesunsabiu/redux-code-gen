import { readFileStr } from 'https://deno.land/std@v0.51.0/fs/read_file_str.ts';
import {
  mapArgsToPoj,
  space4,
  capitalize,
  appendFilerStr
} from './common/helper.ts';
import {
  getActionKeyFilePath,
  getActionCreatorFilePath,
  getActionPayloadFilePath,
  getReducerFilePath,
  dirname
} from './common/file_path_helper.ts';
import {
  enumRegExp,
  insertToEnum,
  getEnumName,
  getInsertActionKeyContent
} from './action_key/helper.ts';
import { getInsertActionCreatorContent, getActionPayloadFileContent } from './action_creator/helper.ts';
import { getReducerFileContent, insertNewReducerHandler } from './reducer/helper.ts';

async function reduxCodeGenerator(
  { baseDir = `${Deno.cwd()}`, actionPrefix, key, payload }: {
    baseDir?: string;
    actionPrefix: string;
    key: string;
    payload: string;
  },
) {

  /** insert action key */
  const keyFilePath = getActionKeyFilePath(baseDir, actionPrefix);
  insertOrCreate(keyFilePath, {
    insertCallback: () => insertKey(keyFilePath, { prefix: actionPrefix, key }),
    createCallback: () => createKeyFile(keyFilePath, { prefix: actionPrefix, key})
  });

  /** insert action creator */
  const actionCreatorFilePath = getActionCreatorFilePath(baseDir, actionPrefix);
  insertOrCreate(actionCreatorFilePath, {
    insertCallback: () => insertActionCreator(actionCreatorFilePath, { prefix: actionPrefix, key, payload }),
    createCallback: () => createActionCreatorFile(actionCreatorFilePath, { prefix: actionPrefix, key, payload })
  });
  /** insert action payload */
  const actionPayloadFilePath = getActionPayloadFilePath(baseDir, actionPrefix);
  insertOrCreate(actionPayloadFilePath, {
    insertCallback: () => Promise.resolve(),
    createCallback: () => createActionPayloadFile(actionPayloadFilePath, actionPrefix)
  });

  /** insert reducer */
  const reducerFilePath = getReducerFilePath(baseDir, actionPrefix);
  insertOrCreate(reducerFilePath, {
    insertCallback: () => insertReducerFile(reducerFilePath, { prefix: actionPrefix, key }),
    createCallback: () => createReducerFile(reducerFilePath, { prefix: actionPrefix, key })
  })
}

function insertOrCreate(path: string, { insertCallback, createCallback }: { insertCallback: () => Promise<void>; createCallback: () => Promise<void> }) {
  Deno.stat(path)
    .then((result) => {
      if (result.isFile) {
        return insertCallback();
      } else {
        throw new Error('No such file');
      }
    })
    .catch((error) => {
      return Deno.stat(dirname(path)).then(
        (result) => Promise.reject('exist dir'),
        async (error) => {
          await Deno.mkdir(dirname(path), { recursive: true });
          return Promise.reject('after create dir');
        }
      );
    })
    .catch(() => {
      return createCallback();
    })
    
}

/**
 * 在 key file 存在的前提下 插入新的 key
 */
async function insertKey(keyFilePath: string, opt: { prefix: string; key: string; }) {
  const insertContent = getInsertActionKeyContent(opt.prefix, opt.key);
  const enumName = getEnumName(keyFilePath);
  const code = await readFileStr(keyFilePath);
  if (enumRegExp(enumName).test(code)) {
    console.log("在现有文件 %s 中插入 Key: %s", keyFilePath, capitalize(opt.key));
    return Deno.writeTextFile(keyFilePath, insertToEnum(code, enumName, insertContent));
  }
  return Promise.resolve();
}

function createKeyFile(keyFilePath: string, opt: { prefix: string; key: string; }) {
  console.log('创建新的 action key 文件: ', keyFilePath);
  const insertContent = getInsertActionKeyContent(opt.prefix, opt.key);
  return Deno.writeTextFile(keyFilePath, `\nexport enum ${getEnumName(keyFilePath)} {\n${space4}${insertContent}\n}\n`);
}

async function insertActionCreator(
  path: string,
  opt: { prefix: string; key: string; payload: string }
) {
  console.log('在现有文件 %s 中插入 action creator: %s', path, opt.key);
  return appendFilerStr(path, getInsertActionCreatorContent(opt));
}

function createActionCreatorFile(
  path: string,
  opt: { prefix: string; key: string; payload: string }
) {
  console.log('创建新的 action 文件', path);
  /** 下面的代码 请不要格式化 */
  const actionCreatorFileTpl = "\nimport { #prefix#ActionKey } from './#_prefix#ActionKey';\n#content#";

  const insertActionCreatorContent = getInsertActionCreatorContent(opt);
  const prefix = opt.prefix;
  const newActionCreator = actionCreatorFileTpl
                              .replace(/#_prefix#/g, prefix)
                              .replace(/#prefix#/g, capitalize(prefix))
                              .replace(/#content#/g, insertActionCreatorContent);
  
  return Deno.writeTextFile(path, newActionCreator);
}

async function createActionPayloadFile(path: string, prefix: string) {
  console.log('创建新的 action payload 文件', path);
  return Deno.writeTextFile(path, getActionPayloadFileContent(prefix));
}

async function createReducerFile(path: string, opt: { prefix: string; key: string }) {
  console.log('创建新的 action reducer 文件', path);
  return Deno.writeTextFile(path, getReducerFileContent(opt.prefix, opt.key));
}

async function insertReducerFile(path: string, opt: { prefix: string; key: string }) {
  console.log('在现有文件 %s 中插入 reducer handler: %s', path, `${opt.key}Handler`);
  const dataExisted = await Deno.readTextFile(path);
  return Deno.writeTextFile(path, insertNewReducerHandler(dataExisted, opt));
}

if (import.meta.main) {
  const args: any = mapArgsToPoj(Deno.args);
  reduxCodeGenerator(args);
}
