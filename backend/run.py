import os
from app import create_app

app = create_app(os.getenv('FLASK_ENV', 'default'))

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=port)
