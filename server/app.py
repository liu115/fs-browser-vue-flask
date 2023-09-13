import csv
import os
from flask import Flask, jsonify, send_file, request, render_template
from flask_cors import CORS

app = Flask(__name__, template_folder="static")
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})


@app.route('/get', methods=['GET'])
def get_path():
    path = request.args.get("path", "/")
    if path[0] != "/":
        path = "/" + path

    if os.path.isdir(path):
        ret = []
        for x in os.listdir(path):
            ret.append({
                "name": x,
                "path": os.path.join(path, x),
                "isDir": os.path.isdir(os.path.join(path, x)),
                "size": os.path.getsize(os.path.join(path, x)) / 1024.0,
                "mtime": os.path.getmtime(os.path.join(path, x)),
            })
        return jsonify(ret)
    else:
        return send_file(path)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def main(path):
    return render_template('app.html')


if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=8080, debug=True)
    app.run(port=8081, debug=True)
