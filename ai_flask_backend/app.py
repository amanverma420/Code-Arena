from flask import Flask
from flask_cors import CORS
from ai_routes import ai_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(ai_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True, port=5000)
