import fs from "node:fs";
import ts from "typescript";
const configPath = ts.findConfigFile(".", ts.sys.fileExists, "tsconfig.json");
const config = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  ".",
);
const host = {
  getCompilationSettings: () => config.options,
  getScriptFileNames: () => config.fileNames,
  getScriptVersion: () => "0",
  getScriptSnapshot: (file) =>
    ts.sys.fileExists(file)
      ? ts.ScriptSnapshot.fromString(ts.sys.readFile(file))
      : undefined,
  getCurrentDirectory: () => process.cwd(),
  getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
  fileExists: ts.sys.fileExists,
  readFile: ts.sys.readFile,
  readDirectory: ts.sys.readDirectory,
};
const service = ts.createLanguageService(host);
for (const file of config.fileNames.filter(
  (f) => f.startsWith("src/") || f.startsWith("tests/"),
)) {
  for (const change of service.organizeImports(
    { type: "file", fileName: file },
    {},
    {},
  )) {
    let source = fs.readFileSync(change.fileName, "utf8");
    for (const edit of change.textChanges.sort(
      (a, b) => b.span.start - a.span.start,
    )) {
      source =
        source.slice(0, edit.span.start) +
        edit.newText +
        source.slice(edit.span.start + edit.span.length);
    }
    fs.writeFileSync(change.fileName, source);
  }
}
