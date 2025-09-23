FROM maven:3.9.6-eclipse-temurin-17 as builder

WORKDIR /app

# Copy pom.xml first (no subfolder prefix)
COPY pom.xml .

RUN mvn dependency:go-offline

# Copy entire project contents (no subfolder prefix)
COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

CMD ["java", "-jar", "app.jar"]
