import { reducerFileTpl } from "./reducer_tpl.ts";
import { capitalize } from "./helper.ts";

export function getReducerFileContent(prefix: string, key: string) {
  return reducerFileTpl
    .replace(/#_prefix#/g, prefix)
    .replace(/#prefix#/g, capitalize(prefix))
    .replace(/#_key#/g, key)
    .replace(/#key#/g, capitalize(key));
}
