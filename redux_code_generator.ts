import { readFileStr } from "https://deno.land/std@v0.51.0/fs/read_file_str.ts";
import { writeFileStr } from "https://deno.land/std@v0.51.0/fs/write_file_str.ts";
import {
  mapArgsToPoj,
  space4,
  capitalize
} from "./helper.ts";
import { getActionKeyFilePath, getActionCreatorFilePath } from "./file_path_helper.ts";
import {
  enumRegExp,
  insertToEnum,
  getEnumName,
  getInsertActionKeyContent
} from "./redux_key_helper.ts";
import { getInsertActionCreatorContent } from "./redux_action_creator_helper.ts";

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
    insertCallback: () => Promise.resolve(),
    createCallback: () => createActionCreatorFile(actionCreatorFilePath, { prefix: actionPrefix, key, payload })
  });
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
    console.log("尝试插入 枚举 类型的Key");
    return writeFileStr(keyFilePath, insertToEnum(code, enumName, insertContent));
  }
  return Promise.resolve();
}

function createKeyFile(keyFilePath: string, key: string) {
  console.log('创建新的 actionKey 文件', keyFilePath);
  const insertContent = getInsertActionKeyContent(key);
  return Deno.writeTextFile(keyFilePath, `\nexport enum ${getEnumName(keyFilePath)} {\n${space4}${insertContent}\n}\n`);
}

function createActionCreatorFile(
  path: string,
  opt: { prefix: string; key: string; payload: string }
) {
  console.log('创建新的 action 文件', path);
  /** 下面的代码 请不要格式化 */
  const actionCreatorFileTpl = "import { ActionPayloadRecord } from '@/model/types';\nimport { #prefix#ActionKey } from './#_prefix#ActionKey';\n\nexport const #prefix#ActionCreator = {\n    #content#\n};\n\ntype #prefix#ActionCreatorType = typeof #prefix#ActionCreator;\nexport type #prefix#Payload = ActionPayloadRecord<#prefix#ActionCreatorType>;\n";

  const insertActionCreatorContent = getInsertActionCreatorContent(opt);
  const prefix = opt.prefix;
  const newActionCreator = actionCreatorFileTpl
                              .replace(/#_prefix#/g, prefix)
                              .replace(/#prefix#/g, capitalize(prefix))
                              .replace(/#content#/g, insertActionCreatorContent);
  
  return Deno.writeTextFile(path, newActionCreator);
}

if (import.meta.main) {
  console.log("generator ...");
  const args: any = mapArgsToPoj(Deno.args);
  console.log("receive args", args);
  reduxCodeGenerator(args);
}
