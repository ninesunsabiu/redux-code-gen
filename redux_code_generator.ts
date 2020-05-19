import { readFileStr } from "https://deno.land/std@v0.51.0/fs/read_file_str.ts";
import { writeFileStr } from "https://deno.land/std@v0.51.0/fs/write_file_str.ts";
import {
  enumRegExp,
  insertToEnum,
  mapArgsToPoj,
  getEnumName,
  space4,
  getActionKeyFilePath,
  getInsertActionKeyContent
} from "./helper.ts";

async function reduxCodeGenerator(
  { baseDir = `${Deno.cwd()}`, actionPrefix, key, payload }: {
    baseDir?: string;
    actionPrefix: string;
    key: string;
    payload: string;
  },
) {
  const keyFilePath = getActionKeyFilePath(baseDir, actionPrefix);
  Deno.stat(keyFilePath).then((result) => {
    if (result.isFile) {
      return insertKey(keyFilePath, key);
    } else {
      throw new Error('is not file create new actionKey file');
    }
  }).catch((error) => {
    createKeyFile(keyFilePath, key);
  });
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

if (import.meta.main) {
  console.log("generator ...");
  const args: any = mapArgsToPoj(Deno.args);
  console.log("receive args", args);
  reduxCodeGenerator(args);
}
