# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the rest of the application
COPY . .

# Install frontend dependencies
RUN npm install --legacy-peer-deps

# Build frontend
RUN npm run build

# Run database migrations and create admin user
RUN cd backend && python -m alembic upgrade head && python create_admin.py

# Expose port
EXPOSE 8000

# Start the application
CMD ["sh", "-c", "(cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &) && npx serve -s dist -l 3000"] 