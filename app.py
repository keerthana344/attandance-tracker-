from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    # Explicitly defining host and port as requested
    app.run(debug=True, host='127.0.0.1', port=5000)
