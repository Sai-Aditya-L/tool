import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', '77ba9b12972f28ff2e340f50309e8276')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///site.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', '0fcfd01a80636c4d09912ad8607cfd04')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds
