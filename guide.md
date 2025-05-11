# Project Overview

Fraud detection system

<br>

# Setup Frontend Environnement

## Install Project dependencies

```
cd client
npm install

```



<br>

# Setup Backend Environnement
## Prerequisites

- Install Python 3.13.1
- Install Docker
- PostgreSQL (optional)

## Create Virtual Environment

```
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
.\venv\Scripts\activate
```

## Install Project Dependencies
```
cd server
pip install -r requirements.txt
```

## Setup Environnement Variables

Create .env file in /server

Paste the following secrets int :

```
DB_NAME=DATABASE_NAME
DB_USER=DATABASE_USER
DB_PASSWORD=DATABASE_PASSWORD
DB_PORT=5432
```


## Database Setup 

```
docker-compose up -d postgres
python app/main.py  # This will create tables via SQLAlchemy
```

## Run Project 

```
uvicorn app.main:app --reload
```

