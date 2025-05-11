# Project Overview

Fraud detection system

<br>

# Setup Frontend Environnement

## Install Project dependencies

```
npm install
```



<br>

# Setup Backend Environnement

- Install Python 3.13.1
- Install Docker

## Setup Environnement Variables

Create .env file in /server

Paste the following secrets int :

```
DB_NAME=DATABASE_NAME
DB_USER=DATABASE_USER
DB_PASSWORD=DATABASE_PASSWORD
DB_PORT=5432
```

## Install Project dependencies

```
pip install requirement.tsx 
```

## Setup Database 

```
docker-compose up -d
```

## Run Project 

```
uvicorn app.main:app --reload
```

