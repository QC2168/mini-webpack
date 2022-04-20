import path from "path";
import fs from "fs";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
function createAssets() {
  //  获取文件
  const source = fs.readFileSync("./example/main.js", {
    encoding: "utf-8",
  });
  //  获取依赖
  const ast = parser.parse(source, {
    sourceType: "module",
  });
  //  AST
  const deps = [];
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    },
  });
  //   console.log(source);
  return {
    source,
    deps,
  };
}

// const asset =createAssets();
// console.log(asset);

function createGraph(filePath) {
  const mainAsset = createAssets(filePath);
  console.log(mainAsset);
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAssets(path.resolve("./example", relativePath));
      console.log(child);
      // queue.push(path)
    });
  }
}

console.log(createGraph());
