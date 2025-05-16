import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from jinja2 import Environment, FileSystemLoader
import os

env = Environment(loader=FileSystemLoader("app/templates"))

def send_email(
    recipient: str,
    subject: str,
    template: str,
    context: dict
) -> None:
    """Send email using SMTP"""
    template = env.get_template(template)
    html_content = template.render(**context)
    
    msg = MIMEMultipart()
    msg['From'] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
    msg['To'] = recipient
    msg['Subject'] = subject
    
    msg.attach(MIMEText(html_content, "html"))
    
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)

def send_reset_password_email(email: str, token: str) -> None:
    """Send password reset email"""
    reset_link = f"{settings.FRONTEND_URL}reset-password?token={token}"
    send_email(
        recipient=email,
        subject="Password Reset Request",
        template="password_reset.html",
        context={
            "reset_link": reset_link,
            "expiry_minutes": settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
        }
    )