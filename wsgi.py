"""
WSGI (web server gateway interface) entrypoint

This is only used in production environment by gunicorn to launch the app
(with production capabilities like multithreaded support)

To deploy this app in production, run the following (replace <> accordingly):

    gunicorn --workers <threads> --bind 0.0.0.0:<port> wsgi:app

"""

from backend import app

if __name__ == "__main__":
    app.run()
