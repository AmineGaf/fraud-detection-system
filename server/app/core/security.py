import logging
from passlib.context import CryptContext

# Configure passlib to suppress warnings
logging.getLogger('passlib').setLevel(logging.ERROR)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__ident="2b",
    bcrypt__rounds=12   
)

def get_password_hash(password: str) -> str:
    if not password:
        raise ValueError("Password cannot be empty")
    return pwd_context.hash(password)