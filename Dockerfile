# Builds the Docker containier for the app

# Init the containter and update it
FROM python:3.8
RUN apt -y update && apt -y upgrade

# Install necessary libraries
COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt

# Run app
CMD ["python3", "backend.py"]
