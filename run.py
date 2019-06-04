import os

from init_app import create_app

initialized_app = create_app(os.getenv('FLASK_CONFIG', 'dev'))

if __name__ == '__main__':
    initialized_app.run(
        host=initialized_app.config.get('HOST', 'localhost'),
        port=initialized_app.config.get('PORT', 5000)
    )
