[![Quality Gate Status](https://sonar.fmr-labs.es/api/project_badges/measure?project=docker-admin&metric=alert_status&token=sqb_e90ad2606e8f522583a4d2a1e6f55e803b28a2ea)](https://sonar.fmr-labs.es/dashboard?id=docker-admin)
[![Coverage](https://sonar.fmr-labs.es/api/project_badges/measure?project=docker-admin&metric=coverage&token=sqb_e90ad2606e8f522583a4d2a1e6f55e803b28a2ea)](https://sonar.fmr-labs.es/dashboard?id=docker-admin)
[![Reliability Rating](https://sonar.fmr-labs.es/api/project_badges/measure?project=docker-admin&metric=software_quality_reliability_rating&token=sqb_e90ad2606e8f522583a4d2a1e6f55e803b28a2ea)](https://sonar.fmr-labs.es/dashboard?id=docker-admin)
[![Security Rating](https://sonar.fmr-labs.es/api/project_badges/measure?project=docker-admin&metric=software_quality_security_rating&token=sqb_e90ad2606e8f522583a4d2a1e6f55e803b28a2ea)](https://sonar.fmr-labs.es/dashboard?id=docker-admin)
# 🛠️ Docker Admin

A web administration panel designed to simplify the startup/shutdown of specific containers.

Built with **Node.js**, **Express**, **PostgreSQL**, **TailwindCSS** and **daisyUI**.

## Features
- User management (sign-up, sign-in, session)
- Users inactive until admin aproved
- Password encryption with `bcrypt`
- Connection to PostgreSQL database

## 💻 Installation
Clone the repository:
```bash
git clone https://github.com/FMR7/docker-admin.git
cd docker-admin
```


## 📦 Docker Deployment

Choose one of the two deployment options below:

<details close>
<summary><h2>🟢 Option 1: App + Database in One Deployment (Recommended)</h2></summary>

This option deploys both the application and PostgreSQL database together.

### ⚙️ 1. Configure Environment Variables

Edit the `docker-compose.yml` file and replace the placeholder values with your actual environment configuration.
Only `JWT_SECRET` and `SSL_KEY`/`SSL_CERT` paths should be changed:
```yaml
environment:
  NODE_ENV: production
  DB_HOST: db
  DB_PORT: 5432
  DB_NAME: mydatabase
  DB_SCHEMA: public
  DB_USER: dbuser
  DB_PASSWORD: securepassword
  JWT_SECRET: changeme-jwt-secret
  SSL: "true"
  SSL_KEY: /certs/key.pem
  SSL_CERT: /certs/cert.pem
  PORT: 3000
  ENABLE_DB_LOGS: "true"
```

### 🐳 2. Build and start the containers

```bash
docker compose up --build
```

The database will be initialized automatically from [initDB.sql](backend/src/config/initDB.sql) on first run.

### 🔐 3. Certificates

Ensure you have valid SSL certificates in the `certs` directory. 

You can generate self-signed certificates for testing purposes:
```bash
mkdir certs
openssl req -nodes -new -x509 -keyout certs/key.pem -out certs/cert.pem
```

### 🧪 4. Test the Deployment

Visit: [https://localhost](https://localhost)

### 🟢 5. Ready
The default admin account (`admin` / `admin`) is pre-created and active. Log in immediately to create additional users and manage their roles. For security, it's recommended to create a new admin user and deactivate the default account afterward.

</details>

<details close>
<summary><h2>🔵 Option 2: App Only (External Database)</h2></summary>

Use this if you have an external PostgreSQL database already running.

### ⚙️ 1. Configure Environment Variables

Edit the `docker-compose_noDB.yml` file and replace the placeholder values with your actual environment configuration.
Update all `DB_*` values to point to your external database:
```yaml
environment:
  NODE_ENV: production
  DB_HOST: db.example.local
  DB_PORT: 5432
  DB_NAME: mydatabase
  DB_SCHEMA: public
  DB_USER: dbuser
  DB_PASSWORD: securepassword
  JWT_SECRET: changeme-jwt-secret
  SSL: "true"
  SSL_KEY: /certs/key.pem
  SSL_CERT: /certs/cert.pem
  PORT: 3000
  ENABLE_DB_LOGS: "true"
```

### 🐘 2. Initialize Your Database

Run the initialization script on your external PostgreSQL database:
```bash
psql -U dbuser -h db.example.local -p 5432 -d mydatabase -f ./backend/src/config/initDB.sql
```

### 🐳 3. Build and start the container

```bash
docker compose -f docker-compose_noDB.yml up --build
```

### 🔐 4. Certificates

Ensure you have valid SSL certificates in the `certs` directory. 

You can generate self-signed certificates for testing purposes:
```bash
mkdir certs
openssl req -nodes -new -x509 -keyout certs/key.pem -out certs/cert.pem
```

### 🧪 5. Test the Container

Visit: [https://localhost](https://localhost)

### 🟢 6. Ready
The default admin account (`admin` / `admin`) is pre-created and active. Log in immediately to create additional users and manage their roles. For security, it's recommended to create a new admin user and deactivate the default account afterward.

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

JWT_SECRET: changeme-jwt-secret
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



