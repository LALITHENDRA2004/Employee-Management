# 🏢 Employee Management System

A **full-stack Employee Management System** with a **pure HTML, CSS, and JavaScript frontend** and a **Java Spring Boot backend**.  
The application enables efficient management of employee records via an intuitive web interface and REST API backend.

***

## 🚀 Features

- **Employee CRUD** – Add, view, update, and delete employee details.
- **Simple Frontend** – Built with only HTML, CSS, and JavaScript for speed and simplicity.
- **RESTful API Backend** – Spring Boot handles business logic and API services.
- **MySQL Database** – Persistent storage for employee data.
- **Responsive Design** – Works across desktop, tablet, and mobile devices.
- **Clear Separation** – Frontend and backend codebases are organized in separate folders.

***

## 📂 Project Structure

```
EmployeeManagement
├── ems-frontend/                     # Frontend (HTML, CSS, JavaScript)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/ (if any images, icons, style assets)
│
├── .vscode/
├── ems-backend/                       # Backend (Spring Boot + Java)
│   ├── .mvn/wrapper/
│   ├── .vscode/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/net/javaguides/ems/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exception/
│   │   │   │   ├── mapper/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   │       └── implementation/
│   │   │   └── resources/
│   │   │       ├── static/
│   │   │       └── templates/
│   │   └── test/java/net/javaguides/ems/
│   └── target/… (compiled classes & build artifacts)
```

***

## 🛠️ Technologies Used

**Frontend:**
- HTML5
- CSS3
- JavaScript (Vanilla)

**Backend:**
- Java
- Spring Boot
- Spring Data JPA
- Maven

**Database:**
- MySQL

***

## 🔧 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/LALITHENDRA2004/Employee-Management.git
cd EmployeeManagement
```

***

### 2️⃣ Frontend Setup
1. Go to the frontend folder:
```bash
cd ems-frontend
```
2. Open `index.html` directly in a browser, **or** run a simple local web server:
```bash
# Python 3
python -m http.server 5500
```
3. Ensure the backend is running — the frontend will send API requests to it.

***

### 3️⃣ Backend Setup
1. Navigate to backend folder:
```bash
cd ../ems-backend
```
2. Configure MySQL in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ems
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```
3. Run the backend:
```bash
mvn spring-boot:run
```
Backend will start at: **http://localhost:8080**

***

## 📄 API Endpoints (Examples)

| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| GET    | `/api/employees`       | Get all employees      |
| GET    | `/api/employees/{id}`  | Get employee by ID     |
| POST   | `/api/employees`       | Add new employee       |
| PUT    | `/api/employees/{id}`  | Update employee        |
| DELETE | `/api/employees/{id}`  | Delete employee        |

***

## 👤 Author

**Lalitendra Nichenakolla**  
- [GitHub](https://github.com/LALITHENDRA2004)  
- [LinkedIn](https://www.linkedin.com/in/lalithendranichenakolla/)
