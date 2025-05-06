# 🛠️ Docker Admin

A web administration panel designed to simplify the startup/shutdown of specific containers.

Built with **Node.js**, **Express**, **PostgreSQL**, and **Bootstrap**.

## Features
- User management (sign-up, sign-in, session)
- Password encryption with `bcrypt`
- Connection to PostgreSQL database

## 🐘 Database
```sql
CREATE TABLE public.usuarios (
	username varchar(20) NOT NULL,
	"password" varchar(512) NOT NULL,
	active bool DEFAULT false NOT NULL,
	password_wrong_tries int4 DEFAULT 0 NOT NULL,
	"admin" bool DEFAULT false NOT NULL,
	CONSTRAINT usuarios_pk PRIMARY KEY (username)
);
```

## 💻 Installation
Clone the repository:
```bash
git clone https://github.com/FMR7/docker-admin.git
cd docker-admin
```

## 🔧 Configuration
Create the .env file, add the database config and containers IDs:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=changeme
DB_NAME=public
DB_PORT=5432

SESSION_SECRET = 1234567890
SSL = true

# IDs of the containers that will be managed
CONTAINERS = '07ccf7644c771b5e59eadb37b7d1fb3cb50bc0d502893e0b1c7a47db1b4a0932,13891f9cd5204912f44f64d684849640725dd4f3a8638434f9467c566b304f05'
```

## 🚀 Run
```bash
node index.js
```

## 🟢 Ready
Now follow the link in the console and sign up.
Then activate your user and give yourself the admin role using your favorite DBMS.



