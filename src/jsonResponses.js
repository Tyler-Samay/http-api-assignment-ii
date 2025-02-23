const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });
  response.write(JSON.stringify(object));
  response.end();
};

const users = {};

// Get the users object
const getUsers = (request, response) => {
  respondJSON(request, response, 200, { users });
};

// Default JSON object for a 404 error
const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

// Add a user to the object
const addUser = (request, response) => {
  let body = '';

  // Read the body of the request
  request.on('data', (chunk) => {
    body += chunk;
  });

  // Parse the body of the request
  request.on('end', () => {
    let parsedBody;

    try {
      parsedBody = JSON.parse(body);
    } catch (error) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'Invalid JSON', id: 'badRequest' }));
      return;
    }

    // Default JSON missing both name and age
    const responseJSON = {
      message: 'Name and age are both required.',
      id: 'missingParams',
    };

    // If the name or age is missing, send a 400 status
    if (!parsedBody.name || !parsedBody.age) {
      respondJSON(request, response, 400, responseJSON);
    }

    // If the user already exists, send a 204 status and update the age
    if (users[parsedBody.name]) {
      users[parsedBody.name].age = parsedBody.age;
      response.writeHead(204, { 'Content-Type': 'application/json' });
      response.end();
    }

    // Add the user to the object
    users[parsedBody.name] = {
      name: parsedBody.name,
      age: parsedBody.age,
    };
    responseJSON.message = 'User added successfully.';
    respondJSON(request, response, 201, responseJSON);
  });
};

module.exports = { getUsers, notReal, addUser };
