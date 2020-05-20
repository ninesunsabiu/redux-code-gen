import { resolve as PathResolve } from "https://deno.land/std@v0.51.0/path/mod.ts";

export function getReduxSuitCommonFilePath(baseDir: string, prefix: string) {
  return PathResolve(baseDir, prefix);
}

export function getActionKeyFilePath(baseDir: string, prefix: string) {
  return PathResolve(getReduxSuitCommonFilePath(baseDir, prefix), `${prefix}ActionKey.ts`);
}

export function getActionCreatorFilePath(baseDir: string, prefix: string) {
  return PathResolve(getReduxSuitCommonFilePath(baseDir, prefix), `${prefix}Action.ts`);
}

export function getReducerFilePath(baseDir: string, prefix: string) {
  return PathResolve(getReduxSuitCommonFilePath(baseDir, prefix), `${prefix}Reducer.ts`);
}

export function getSagaPath(baseDir: string, prefix: string) {
  return PathResolve(getReduxSuitCommonFilePath(baseDir, prefix), `${prefix}Saga.ts`);
}
