import { readFileStr } from "https://deno.land/std@v0.51.0/fs/read_file_str.ts";
import { writeFileStr } from "https://deno.land/std@v0.51.0/fs/write_file_str.ts";
import {
  mapArgsToPoj,
  space4,
  capitalize
} from "./helper.ts";
import {getActionKeyFilePath, getActionCreatorFilePath, getActionPayloadFilePath, getReducerFilePath } from "./file_path_helper.ts";
import {
  enumRegExp,
  insertToEnum,
  getEnumName,
  getInsertActionKeyContent
} from "./redux_key_helper.ts";
import { getInsertActionCreatorContent, getActionPayloadFileContent } from "./redux_action_creator_helper.ts";
import { getReducerFileContent } from "./redux_reducer_helper.ts";

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
    insertCallback: () => insertKey(keyFilePath, key),
    createCallback: () => createKeyFile(keyFilePath, key)
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
    insertCallback: () => Promise.resolve(),
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
      createCallback();
    })
}

/**
 * 在书写 key.ts 的文件中 插入key
 * 确保 keyFilePath 文件存在 
 */
async function insertKey(keyFilePath: string, key: string) {
  const insertContent = getInsertActionKeyContent(key);
  const enumName = getEnumName(keyFilePath);
  const code = await readFileStr(keyFilePath);
  if (enumRegExp(enumName).test(code)) {
    console.log("尝试插入 枚举 类型的Key", keyFilePath);
    return writeFileStr(keyFilePath, insertToEnum(code, enumName, insertContent));
  }
  return Promise.resolve();
}

function createKeyFile(keyFilePath: string, key: string) {
  console.log('创建新的 actionKey 文件', keyFilePath);
  const insertContent = getInsertActionKeyContent(key);
  return Deno.writeTextFile(keyFilePath, `\nexport enum ${getEnumName(keyFilePath)} {\n${space4}${insertContent}\n}\n`);
}

async function insertActionCreator(
  path: string,
  opt: { prefix: string; key: string; payload: string }
) {
  console.log('在已有文件中插入 action creator', path);
  const dataExisted = await Deno.readTextFile(path);
  return Deno.writeTextFile(path, `${dataExisted}\n${getInsertActionCreatorContent(opt)}`);
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
  return Deno.writeTextFile(path, getActionPayloadFileContent(prefix));
}

async function createReducerFile(path: string, opt: { prefix: string; key: string }) {
  return Deno.writeTextFile(path, getReducerFileContent(opt.prefix, opt.key));
}

if (import.meta.main) {
  console.log("generator ...");
  const args: any = mapArgsToPoj(Deno.args);
  console.log("receive args", args);
  reduxCodeGenerator(args);
}
