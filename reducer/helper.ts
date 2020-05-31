import { reducerFileTpl, reducerSwitchCaseTpl, reducerStateHandlerTpl } from './reducer_tpl.ts';
import { replacePrefixAndKey } from '../common/helper.ts';

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