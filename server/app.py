from flask import Flask
from flask_cors import CORS
from resume import resume_bp

def create_app():
    app = Flask(__name__)

    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    # Register Blueprints
    app.register_blueprint(resume_bp, url_prefix='/resume')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
