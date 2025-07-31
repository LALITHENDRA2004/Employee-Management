# Use official OpenJDK 17 base image
FROM openjdk:17-jdk-slim

# Set working directory inside container
WORKDIR /app

# Copy all files into the container
COPY . .

# Build the application using Maven Wrapper if present, or fallback to Maven
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Run the generated jar file
CMD ["java", "-jar", "target/ems-backend-0.0.1-SNAPSHOT.jar"]
