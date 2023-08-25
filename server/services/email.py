import smtplib
import ssl
from email.message import EmailMessage
from flask_mail import Message
from extensions import mail
import os
from dotenv import load_dotenv

load_dotenv()
EMAIL = os.environ.get("GMAIL_EMAIL")
PASSWORD = os.environ.get("GMAIL_PASSWORD")

def send_email(pet_name, last_deworm, recipient_email):
    sender_email = EMAIL
    email_password = PASSWORD # password for python app to log in to Gmail

    subject = 'Reminder to deworm your pet'
    body = f"""
            Your pet {pet_name} was last dewormed in {last_deworm}. Please have {pet_name} deworm at your earliest convenience!
            """
    em = EmailMessage()
    em['From'] = sender_email
    em['To'] = recipient_email
    em['Subject'] = subject
    em.set_content(body)

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(sender_email, email_password)
        smtp.sendmail(sender_email, recipient_email, em.as_string())
        

def send_flask_mail(pet_name, last_deworm, recipient_email):
   msg = Message('Deworm Reminder from Petbook!', sender = EMAIL, recipients = [recipient_email])
   msg.body = f"""
            Your pet {pet_name} was last dewormed in {last_deworm}. Please have {pet_name} deworm at your earliest convenience!
            """
   mail.send(msg)
   return "Sent"