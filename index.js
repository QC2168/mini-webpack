import path from "path";
import fs from "fs";
import ejs from "ejs";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import { transformFromAst } from "@babel/core";
function createAssets(filePath) {
  //  获取文件 转ast
  const source = fs.readFileSync(filePath, {
    encoding: "utf-8",
  });
  //  获取依赖
  const ast = parser.parse(source, {
    sourceType: "module",
  });

  const deps = [];
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    },
  });
  const { code } = transformFromAst(ast, null, {
    presets: ["env"],
  });
  console.log(code);
  return {
    filePath,
    source,
    deps,
  };
}

const asset = createAssets("./example/main.js");
console.log(asset);

function createGraph() {
  const mainAsset = createAssets("./example/main.js");
  // console.log(mainAsset);
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAssets(path.resolve("./example", relativePath));
      queue.push(child);
    });
  }
  return queue;
}

const graph = createGraph();

function build(graph) {
  const code = ejs.render();
  const data = graph.map((asset) => ({
    filePath: asset.filePath,
    code: asset.code,
  }));
  console.log(data);
}
