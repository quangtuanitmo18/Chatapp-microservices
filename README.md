# Chat-app Tran Bao Linh

## Technical Specification

**Develop and configure the following components:**

- Microservice website – Provides functionality for managing users and rooms.
- Microservice chat – Provides WebSocket chat functionality.
- Database.
- Web server.

**Requirements for the website service:**

- Must be developed in Python using the FastAPI framework.
- The frontend should be implemented using Jinja2 templates.
- Data storage and retrieval should be in a PostgreSQL or MongoDB database (choice up to the developer).
- Database access should use ORM libraries only.
- The frontend can be minimalistic but should be neat.
- Session management should be implemented.
- The chat page should be implemented on the frontend side, using the API of the chat microservice.
- Interaction with the chat service should occur via JavaScript.
- Authentication for chat should be handled by generating a signed JWT token containing the user's email and the chat room name and passing it to the chat service in the HTTP header.
- A JWT token should only be issued for existing chat rooms and existing users.

**Requirements for the chat service:**

- Must be developed in Python.
- Should use the WebSocket protocol.
- Should not store any information other than open rooms and the users connected to them.
- User authentication should be done by validating the JWT token.
- Should have a method to receive messages and support broadcasting messages to all users connected to a given chat room.

**Requirements for the database:**

- The database chosen should be either PostgreSQL or MongoDB.
- Access to the database should be secured by a login and password.
- The database structure should be planned and described in a report.

**Requirements for the web server:**

- The Nginx web server should be used.
- Proxy pass should be configured for both microservices: HTTP for website and WebSocket for chat at the path /ws.
- Request logging should be enabled.

**General Requirements:**

- The entire project should be packaged using Docker.
- The following directory structure should be supported:
  - At the root, there should be docker-compose.yml and README.md.
  - Each microservice, its code, and Dockerfile should be in its own directory (e.g., website, chat, db, nginx).
- Only one HTTP port should be exposed externally.
- The database should ensure persistence to a local dump directory.
- .gitignore and .dockerignore files should be configured.

## Tech Stack

**Client:** React JS

**Server:** Node JS, Express JS

**Database:** Mongo DB
