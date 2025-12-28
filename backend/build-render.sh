#!/bin/bash
# Build script for Render deployment

# Install Maven if not available
if ! command -v mvn &> /dev/null; then
    echo "Maven not found, using Maven wrapper..."
    chmod +x ./mvnw
    ./mvnw clean package -DskipTests
else
    mvn clean package -DskipTests
fi

