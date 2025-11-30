# Use OpenJDK 20 as base image
FROM openjdk:20-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY mvnw.cmd .
COPY pom.xml .

# Copy source code
COPY src ./src

# Build the application
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/innovaedu-api-0.0.1-SNAPSHOT.jar"]