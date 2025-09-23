# Use a base image with Java and Maven pre-installed
FROM maven:3.9.6-eclipse-temurin-17 as builder

# Set working directory
WORKDIR /app

# Copy the pom.xml and download dependencies first (use cache)
COPY ems-backend/pom.xml .
RUN mvn dependency:go-offline

# Copy the entire project
COPY ems-backend .

# Build the application
RUN mvn clean package -DskipTests

# ---------------------------
# Create the final image with only the JAR
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy the JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Run the app
CMD ["java", "-jar", "app.jar"]
