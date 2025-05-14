[![Quality Gate Status](http://82.165.142.21:9000/api/project_badges/measure?project=docker-admin&metric=alert_status&token=sqb_6715fe38e59635b1d4ad3f4d5f8c53502582f8d6)](http://82.165.142.21:9000/dashboard?id=docker-admin)
[![Coverage](http://82.165.142.21:9000/api/project_badges/measure?project=docker-admin&metric=coverage&token=sqb_6715fe38e59635b1d4ad3f4d5f8c53502582f8d6)](http://82.165.142.21:9000/dashboard?id=docker-admin)
# 🛠️ Docker Admin

A web administration panel designed to simplify the startup/shutdown of specific containers.

Built with **Node.js**, **Express**, **PostgreSQL**, and **Bootstrap**.

## Features
- User management (sign-up, sign-in, session)
- Users inactive until admin aproved
- Password encryption with `bcrypt`
- Connection to PostgreSQL database

## 🐘 Database
Run the script [initDB.sql](https://raw.githubusercontent.com/FMR7/docker-admin/refs/heads/master/backend/src/config/initDB.sql) using your favorite DBMS.

Or in the terminal, type:
```bash
psql -U postgres -h remote_host -p 5432 -d my_database -f ./src/config/initDB.sql
```

## 💻 Installation
Clone the repository:
```bash
git clone https://github.com/FMR7/docker-admin.git
cd docker-admin
```

## 🔧 Configuration
Create the .env file, add the database config, certs and port:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=changeme
DB_NAME=my_database
DB_PORT=5432

SESSION_SECRET = 1234567890
SSL = true
SSL_KEY = './certs/key.pem'
SSL_CERT = './certs/cert.pem'
PORT = 443

ENABLE_DB_LOGS = true
```

## 🛠 Build
```bash
cd frontend
npm i
npm run build
cd ..
```

## 🚀 Run
```bash
node backend/index.js
```

## 🟢 Ready
Now follow the link in the console and sign up.
Then activate your user and give yourself the admin role using your favorite DBMS.



