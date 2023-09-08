const http = require("http");
const path = require("path");
const fs = require("fs");

const SERVERNAME = "localhost";
const PORT = 8080;

const server = http.createServer((req, res) => {
  let fileName = req.url;
  //   console.log(fileName);
  // filenames can be:
  // 1. /
  if (fileName == "/") {
    res.writeHead(301, { Location: "index.html" });
    res.end();
  }

  let filePath = path.join(__dirname, "dist");
  let extName = path.extname(fileName);
  let contentType = "null";

  // if()

  if (extName == ".html") {
    contentType = "text/html";
    filePath = path.join(filePath, fileName);
  } else if (extName == ".css") {
    contentType = "text/css";
    filePath = path.join(filePath, fileName);
  } else if (extName == ".js") {
    contentType = "text/javascript";
    filePath = path.join(filePath, fileName);
  } else if (extName == ".svg") {
    contentType = "image/svg + xml";
    filePath = path.join(filePath, fileName);
    console.log(filePath);
  } else if (extName == ".json") {
    contentType = "application/json";
    filePath = path.join(filePath, fileName);
  } else if (extName == ".ico") {
    extName = ".svg";
    fileName = "favicon.svg";
    contentType = "image/svg + xml";
    filePath = path.join(filePath, "assets", fileName);
  }

  if (contentType == "null") {
    filePath = path.join(filePath, "404.html");
    fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        console.log("Could not readt 404.html : ", filePath);
        return;
      }
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log("Error reading file: ", filePath);
      if (err.code == "ENOENT") {
        let errorFile = path.join(__dirname, "dist", "404.html");
        fs.readFile(errorFile, (err, data) => {
          if (err) {
            console.log("error reading error file");
            return;
          }
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(data);
        });
      }
      return;
    }
    console.log("Read file: ", filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(PORT, SERVERNAME, () => {
  console.log(`server listening on http://${SERVERNAME}:${PORT}`);
});
