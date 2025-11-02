# SArch-IntelliLearn-251

## Quick Start
```bash
git clone <repository>
cd SArch-IntelliLearn-251
cp learningservice/.env.example learningservice/.env
cp teachingservice/.env.example teachingservice/.env
docker compose up
```

## Notes
For learning and teaching service,
- `/swagger-ui.html`: Swagger document
- `/actuator/health`: Health checking

Docker Compose Ports:
- 8080: `nginx` port, proxies to other services
- 8081: `learningservice` port
- 8082: `teachingservice` port
- 8083: `keycloak` port
- 9001: `minio` port

## LearningService Detailed Structure

### Layer Breakdown

#### 1. **Domain Layer** (`/domain`)
Core business logic and domain models - **pure Java with no external dependencies**.

- **`model/`**: Domain entities representing core business concepts
- **`repository/`**: Repository interfaces (contracts only)
- **`service/`**: Domain services containing business logic

#### 2. **Application Layer** (`/application`)
Orchestration layer that coordinates between domain and infrastructure.

- `LearningManagerApplicationService.java`: Interface for application use cases
- `LearningManagerApplicationServiceImpl.java`: Implements use cases by:
  - Calling domain services for business logic
  - Coordinating repositories for data access
  - Handling application-level workflows

#### 3. **Infrastructure Layer** (`/infrastructure`)
Technical implementations and external integrations.

- **`api/`**: REST API layer
  - `LearningManagerController.java`: REST endpoints
  - `dto/`: Data Transfer Objects for API communication
  - `mapper/`: Converts domain models to DTOs

- **`persistence/`**: Data persistence implementations
  - **`jpa/`**: Spring Data JPA implementations
    - `entity/`: JPA annotated database entities
    - `mapper/`: Converts between JPA entities and domain models
    - `repository/`: Spring Data JPA repositories
  - **`repository/`**: Repository implementations (adapters) using JPA

#### 4. **Common Layer** (`/common`)
Cross-cutting concerns used across layers.

- **`exception/`**: Exception handling
  - `ApiError.java`: Standardized error response model
  - `GlobalExceptionHandler.java`: Global exception handling with @ControllerAdvice

- **`response/`**: Standard response wrappers
  - `ApiResponse.java`: Standardized API response wrapper (status, data, message)

#### 5. **Main Application** 
- `LearningserviceApplication.java`: Spring Boot entry point with @SpringBootApplication

### Data Flow Example: Get Courses
```
LearningManagerController (receives HTTP GET)
    ↓
LearningManagerApplicationServiceImpl (orchestrates)
    ↓
LearningManagerServiceImpl (business logic)
    ↓
LearningManagerCourseRepositoryImpl (adapter)
    ↓
JpaCourseRepository (database query)
    ↓
CourseEntity (JPA result)
    ↓
CourseMapper (converts to domain)
    ↓
Course (domain model)
    ↓
CourseResponseMapper (converts to DTO)
    ↓
CourseResponse (HTTP response)
```

### Key Design Patterns
- **Repository Pattern**: Abstracts data access with interfaces
- **Mapper Pattern**: Converts between layers (Entity → Domain → DTO)
- **Dependency Inversion**: Domain layer has no dependencies on infrastructure
- **Layered Architecture**: Clear separation allowing independent testing and modification

### TLDR
- Domain: Core business logic
- Application: Orchestration of use cases (no business logic)
- Infrastructure: Technical implementations (API, persistence)
  - JPA: Database access implementation
  - Repository: Adapters implementing repository interfaces