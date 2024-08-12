from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config

db = SQLAlchemy()
migrate = Migrate()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/*": {"origins": "*"}})
    JWTManager(app)  # Initialize JWT Manager

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
