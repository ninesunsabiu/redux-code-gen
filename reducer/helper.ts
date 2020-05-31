import { reducerFileTpl, reducerSwitchCaseTpl, reducerStateHandlerTpl } from './reducer_tpl.ts';
import { capitalize } from '../common/helper.ts';

function replacePrefixAndKey(str: string, opt: { prefix: string; key: string }) {
  const { prefix, key } = opt;
  return str
    .replace(/#_prefix#/g, prefix)
    .replace(/#prefix#/g, capitalize(prefix))
    .replace(/#_key#/g, key)
    .replace(/#key#/g, capitalize(key));
}

export function getReducerFileContent(prefix: string, key: string) {
  return replacePrefixAndKey(reducerFileTpl, { prefix, key });
}

export function insertNewReducerHandler(code: string, opt: { prefix: string; key: string }) {
  const reducerSwitchCase = replacePrefixAndKey(reducerSwitchCaseTpl, opt);
  const reducerStateHandler = replacePrefixAndKey(reducerStateHandlerTpl, opt);
  return code
          .replace(/^        default:$/m, `${reducerSwitchCase}\n        default:`)
          .replace(/$/s, `\n${reducerStateHandler}\n`);
}