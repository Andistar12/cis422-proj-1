# Builds the Docker container to package the app
# To build this container for a development environment, run the following:
# 
#   docker build -t <tag> --target dev .
#
# For production, run the following:
# 
#   docker build -t <tag> --target prod .

# Init the containter and update it
FROM python:3.8 AS dev
RUN apt -y update && apt -y upgrade

# Install necessary libraries
COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt

# Run app
CMD ["python3", "backend.py"]

# Setup production environment
FROM dev AS prod
COPY . /app
