from flask import *
from flask_cors import CORS
from modules.postgre import *


def create_app():
    app = Flask(__name__)
    CORS(app)
    @app.route("/")
    def home():
        return "Hello World!"

    @app.route("/leaderboard/new_record", methods=["POST"])
    def new_record():
        data = request.json
        print(data)
        connection = start_connection()
        response = save_record(connection, data)   

        return jsonify(response)

    @app.route("/leaderboard", methods=["GET"])
    def leaderboard():
        connection = start_connection()
        data = get_scores(connection)

        return jsonify(data)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000)
