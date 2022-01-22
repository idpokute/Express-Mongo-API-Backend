REST API Backend Template.

Features

- Express framework
- JWT token
- Passport and Local-Strategy
- MongoDB running by docker-compose
- Google SMTP for email reset.

Following .env is required.

```
SITE_URL=http://localhost
PORT=5000

CORS_ORIGIN=http://localhost:8000
COOKIE_SECRET=write_some_text
JWT_SECRET=write_some_text
JWT_REFRESH_SECRET=write_some_text

MONGO_CONNECTION_URL=mongodb://localhost:27017/admin
MONGO_ID=same_id_as_docker_compose_uses
MONGO_PASSWORD=same_password_as_docker_compose_uses

EMAIL=your_gmail
PASSWORD=this_is_not_your_gmail_password
EMAIL_PROVIDER=gmail
EMAIL_HOST=smtp.gmail.com
```
