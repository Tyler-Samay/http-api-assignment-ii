const http = require('http');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  console.log(request.url);

  switch (request.url) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;

    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;

    case '/getUsers':
      jsonHandler.getUsers(request, response);
      break;

    case '/notReal':
      jsonHandler.notReal(request, response);
      break;

    case '/addUser':
      jsonHandler.addUser(request, response);
      break;

    default:
      jsonHandler.notReal(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on port ${port}`);
