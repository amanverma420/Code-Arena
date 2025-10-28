from flask import Flask
from flask_cors import CORS
from ai_routes import ai_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(ai_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
