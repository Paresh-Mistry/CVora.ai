FROM python:3.13-slim

WORKDIR /app


RUN pip install poetry

# Copy dependency files first (better Docker caching)
COPY pyproject.toml poetry.lock* ./

# Disable Poetry virtualenv inside Docker
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install 

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]