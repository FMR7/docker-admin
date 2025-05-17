[![Quality Gate Status](http://82.165.142.21:9000/api/project_badges/measure?project=docker-admin&metric=alert_status&token=sqb_6c8e6a80f24e5fc5190732ec1b2bd391618b9672)](http://192.168.1.130:9000/dashboard?id=docker-admin)
[![Coverage](http://82.165.142.21:9000/api/project_badges/measure?project=docker-admin&metric=coverage&token=sqb_6c8e6a80f24e5fc5190732ec1b2bd391618b9672)](http://192.168.1.130:9000/dashboard?id=docker-admin)
# 🛠️ Docker Admin

A web administration panel designed to simplify the startup/shutdown of specific containers.

Built with **Node.js**, **Express**, **PostgreSQL**, **TailwindCSS** and **daisyUI**.

## Features
- User management (sign-up, sign-in, session)
- Users inactive until admin aproved
- Password encryption with `bcrypt`
- Connection to PostgreSQL database

## 🐘 Database
Run the script [initDB.sql](https://raw.githubusercontent.com/FMR7/docker-admin/refs/heads/master/backend/src/config/initDB.sql) using your favorite DBMS.

Or in the terminal, type:
```bash
psql -U dbuser -h db.example.local -p 5432 -d mydatabase -f ./src/config/initDB.sql
```

## 💻 Installation
Clone the repository:
```bash
git clone https://github.com/FMR7/docker-admin.git
cd docker-admin
```

<details open>
<summary><h2>📦 Docker Deployment</h2></summary>

### ⚙️ 1. Configure Environment Variables

Edit the `docker-compose.yml` file and replace the placeholder values with your actual environment configuration.
Only `DB` values and `SESSION_SECRET` should be changed:
```yaml
environment:
  NODE_ENV: production
  DB_HOST: db.example.local
  DB_PORT: 5432
  DB_NAME: mydatabase
  DB_SCHEMA: public
  DB_USER: dbuser
  DB_PASSWORD: securepassword
  SESSION_SECRET: changeme-session-secret
  SSL: "true"
  SSL_KEY: /certs/key.pem
  SSL_CERT: /certs/cert.pem
  PORT: 3000
  ENABLE_DB_LOGS: "true"
```

### 🐳 2. Build and start the container

```bash
docker compose up --build
```

### 🔐 3. Certificates

Ensure you have valid SSL certificates in the `certs` directory. 

You can generate self-signed certificates for testing purposes:
```bash
mkdir certs
openssl req -nodes -new -x509 -keyout certs/key.pem -out certs/cert.pem
```


### 🧪 4. Test the Container

Visit: [https://localhost](https://localhost)

### 🟢 5. Ready
Now sign up, activate your user and give yourself the admin role using your favorite DBMS.
</details>


<details>
<summary><h2>🚧 Development</h2></summary>

### 🔧 Configuration
Create the .env file, add the database config, certs and port:
```env
NODE_ENV: production

DB_HOST: db.example.local
DB_PORT: 5432
DB_NAME: mydatabase
DB_SCHEMA: public
DB_USER: dbuser
DB_PASSWORD: securepassword

SESSION_SECRET: changeme-session-secret
SSL: "true"
SSL_KEY: /certs/key.pem
SSL_CERT: /certs/cert.pem
PORT: 443

ENABLE_DB_LOGS: "true"
```

### 🛠 Build
```bash
cd frontend
npm i
npm run build
cd ..
```

### 🚀 Run
```bash
node backend/index.js
```

### 🟢 Ready
Now follow the link in the console and sign up.
Then activate your user and give yourself the admin role using your favorite DBMS.
</details>



