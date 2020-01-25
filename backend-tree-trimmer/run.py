import os

from init_app import create_app

initialized_app = create_app()

if __name__ == '__main__':
    initialized_app.run(
        host=os.getenv('FLASK_HOST', '0.0.0.0'),
        port=os.getenv('FLASK_PORT', 80)
    )
