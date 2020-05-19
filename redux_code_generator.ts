import { readFileStr } from "https://deno.land/std@v0.51.0/fs/read_file_str.ts";
import { SEP as FileSeparator } from "https://deno.land/std@v0.51.0/path/separator.ts";
import { writeFileStr } from "https://deno.land/std@v0.51.0/fs/write_file_str.ts";
import {
  toLocaleUpperCase,
  enumRegExp,
  insertToEnum,
  mapArgsToPoj,
  getEnumName,
  space4
} from "./helper.ts";

async function reduxCodeGenerator(
  { baseDir = `${Deno.cwd()}${FileSeparator}`, actionPrefix, key, payload }: {
    baseDir?: string;
    actionPrefix: string;
    key: string;
    payload: object;
  },
) {
  const keyFilePath =
    `${baseDir}${actionPrefix}${FileSeparator}${actionPrefix}ActionKey.ts`;
  Deno.stat(keyFilePath).then((result) => {
    if (result.isFile) {
      insertKey(keyFilePath, key);
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
  const keyValue = key
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .split("_")
    .map(toLocaleUpperCase)
    .join("_");
  const insertContent = `${key} = '${keyValue}'`;
  const enumName = getEnumName(keyFilePath);
  const code = await readFileStr(keyFilePath);
  if (enumRegExp(enumName).test(code)) {
    console.log("尝试插入 枚举 类型的Key");
    writeFileStr(keyFilePath, insertToEnum(code, enumName, insertContent));
  }
}

async function createKeyFile(keyFilePath: string, key: string) {
  console.log('创建新的 actionKey 文件', keyFilePath);
  const keyValue = key
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .split("_")
    .map(toLocaleUpperCase)
    .join("_");
  const insertContent = `${key} = '${keyValue}'`;
  await Deno.writeTextFile(keyFilePath, `\nexport enum ${getEnumName(keyFilePath)} {\n${space4}${insertContent}\n}\n`);
}

if (import.meta.main) {
  console.log("generator ...");
  const args: any = mapArgsToPoj(Deno.args);
  console.log("receive args", args);
  reduxCodeGenerator(args);
}
