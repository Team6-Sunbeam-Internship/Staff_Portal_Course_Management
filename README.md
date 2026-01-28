# Staff Portal Course Management System

A comprehensive enterprise-grade course management platform built with microservices architecture, implementing OAuth 2.1 authentication, Backend for Frontend (BFF) pattern, and resilient design principles.

## 📋 Table of Contents

- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Security Architecture](#-security-architecture)
- [Service Architecture](#-service-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Frontend      │    │       BFF        │    │   Auth Service      │
│   (React)       │◄──►│ (OAuth2 Client)  │◄──►│ (Authorization      │
│                 │    │                  │    │  Server)            │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                │
                                ▼
                       ┌─────────────────────┐
                       │   API Gateway       │
                       │ (OAuth2 Resource    │
                       │  Server + Gateway)  │
                       └─────────────────────┘
                                │
                ┌───────────────┼──────────────┬
                ▼               ▼              ▼              
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ 
        │ User Service │ │   Academic   │ │ Scheduling   │ 
        │ (Resource    │ │   Service    │ │   Service    │ 
        │  Server)     │ │ (Resource    │ │ (Resource    │ 
        │              │ │  Server)     │ │  Server)     │ 
        └──────────────┘ └──────────────┘ └──────────────┘ 
                │               │               │              
                └───────────────┴───────────────┴
                                │
                        ┌───────┴────────┐
                        ▼                ▼
                   ┌─────────┐      ┌─────────┐
                   │  MySQL  │      │  Redis  │
                   │Database │      │  Cache  │
                   └─────────┘      └─────────┘
```

### Architecture Patterns

- **Microservices Architecture**: Independent, scalable services
- **Backend for Frontend (BFF)**: Dedicated backend per frontend
- **API Gateway Pattern**: Centralized routing and security
- **OAuth 2.1 + OIDC**: Modern authentication/authorization
- **Circuit Breaker Pattern**: Service resilience with Resilience4j
- **Session Management**: Redis-backed distributed sessions

## 🚀 Technology Stack

### **Frontend**
- **React 19** - UI library
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

### **Backend Services**
- **Spring Boot 3.5.x** - Microservices framework
- **Spring Security 6.5.x** - OAuth 2.1 + OIDC implementation
- **Spring Cloud Gateway** - API Gateway
- **Spring Data JPA** - Database access
- **Spring Authorization Server** - OAuth2/OIDC provider
- **Resilience4j** - Circuit breaker, retry, timeout patterns

### **Infrastructure**
- **Docker** - Containerization
- **MySQL 8.x** - Relational database
- **Redis** - Session storage and caching
- **Maven** - Build automation

## 🔐 Security Architecture

### **OAuth 2.1 + OpenID Connect Flow**

1. **User Authentication**
   - Frontend initiates login via BFF
   - BFF redirects to Auth Service (Authorization Server)
   - User authenticates with credentials
   - Authorization consent screen (if needed)

2. **Token Exchange**
   - Auth Service returns authorization code to BFF
   - BFF exchanges code for access/refresh tokens
   - Tokens stored securely in Redis (server-side)
   - Frontend receives HTTP-only session cookie

3. **API Authorization**
   - Frontend makes API calls through BFF
   - BFF attaches JWT access token to requests
   - API Gateway validates JWT signature and audience
   - Backend services verify token claims

### **Security Components**

#### **Auth Service (Authorization Server)**
- Issues JWT access tokens and refresh tokens
- Manages user authentication and consent
- Provides OIDC UserInfo endpoint
- Implements key rotation scheduler
- Custom password policies and validation

#### **BFF (OAuth2 Client)**
- Handles OAuth2 authorization code flow
- Stores tokens in Redis (not exposed to frontend)
- Manages session lifecycle
- Proxies API requests with token attachment
- CSRF protection via same-site cookies

#### **API Gateway (Resource Server)**
- Validates JWT tokens on every request
- Enforces audience claims per service
- Routes requests to backend services
- Rate limiting and throttling
- Request/response logging

#### **Backend Services (Protected Resources)**
- Validate JWT tokens
- Extract user context from JWT claims
- Enforce role-based access control (RBAC)
- Audit logging for sensitive operations

### **Token Structure**

```json
{
  "iss": "http://auth-service:8001",
  "sub": "staff123",
  "aud": ["user-service", "academic-service", "scheduling-service"],
  "exp": 1735000000,
  "iat": 1734996400,
  "scope": "openid profile email",
  "roles": ["COURSE_COORDINATOR", "ADMIN"],
  "scopes": ["STAFF_WRITE", "STAFF_READ",..],
}
```

## 🏛️ Service Architecture

### **API Gateway**

**Responsibilities:**
- Centralized entry point for all microservices
- JWT token validation with audience enforcement
- Dynamic request routing based on URL patterns
- Resilience patterns (circuit breaker, retry, timeout)
- Cross-cutting concerns (logging, monitoring, error handling)

**Key Features:**
- Path-based routing to backend services
- Automatic service discovery (optional)
- Custom gateway filters for logging and audience validation
- Global exception handling
- CORS configuration

**Routes:**
- `/apig/users/**` → User Service
- `/apig/academic/**` → Academic Service
- `/apig/scheduling/**` → Scheduling Service
- `/apig/documents/**` → Document Service

### **Auth Service** (Port: 9001)

**Responsibilities:**
- OAuth 2.1 Authorization Server implementation
- User authentication and authorization
- Token issuance (access, refresh, ID tokens)
- OIDC UserInfo endpoint
- Password management and policies

**Key Features:**
- Custom login page with Thymeleaf templates
- Authorization consent management
- JWT token signing with RSA keys
- Key rotation for enhanced security
- Force password change on first login
- Role and scope management

**Endpoints:**
- `POST /oauth2/v1/token` - Token endpoint
- `GET /oauth2/v1/authorize` - Authorization endpoint
- `GET /connect/v1/userinfo` - OIDC UserInfo endpoint
- `POST /oauth2/v1/revoke` - Token revocation
- `GET /.well-known/oauth-authorization-server` - Metadata

### **Backend for Frontend (BFF)** (Port: 8081)

**Responsibilities:**
- OAuth2 client implementation
- Session management with Redis
- Token storage and refresh
- API proxying to backend services
- State preservation during OAuth flow

**Key Features:**
- Authorization code flow with PKCE
- Redis-backed session storage
- Automatic token refresh
- Request proxying with token attachment
- Custom error handling for OAuth failures
- HTTP-only secure cookies

**Endpoints:**
- `GET /oauth2/authorization/auth-service` - Initiate login
- `GET /login/oauth2/code/auth-service` - OAuth callback
- `GET /bff/session` - Session information
- `POST /bff/logout` - Logout
- `ALL /bff/apig/proxy/ or /bff/auth/proxy**` - Proxied API requests

### **User Service** (Port: 8082)

**Responsibilities:**
- User profile management (Staff and Students)
- Role-based menu access control
- Staff and student CRUD operations
- Menu item management
- Bulk student import

**Key Features:**
- Role-based access control (RBAC)
- Staff menu access exceptions
- Student status management
- CSV import for bulk operations
- JWT-based authentication

**API Endpoints:**
```
Staff Management:
- GET    /users/staff
- POST   /users/staff
- PUT    /users/staff/{id}
- DELETE /users/staff/{id}
- GET    /users/staff/{id}

Student Management:
- GET    /users/students
- POST   /users/students
- PUT    /users/students/{id}
- DELETE /users/students/{id}
- POST   /users/students/import

Menu Management:
- GET    /users/menu-items
- POST   /users/menu-items
- PUT    /users/menu-items/{id}

Role Menu Access:
- GET    /users/role-menu-access
- POST   /users/role-menu-access
- PUT    /users/role-menu-access/{id}

Staff Menu Access:
- GET    /users/staff-menu-access
- POST   /users/staff-menu-access
```

### **Academic Service** (Port: 8083)

**Responsibilities:**
- Course lifecycle management
- Academic hierarchy (Course → Module → Subject → Section → Topic)
- Course types and groups
- Batch cycle management
- Infrastructure and premise management

**Key Features:**
- Hierarchical course structure
- Course group filtering
- Batch cycle tracking
- Premise and infrastructure allocation
- Status management for all entities
- Dropdown APIs for frontend forms

**API Endpoints:**
```
Course Management:
- GET    /api/academic/courses
- POST   /api/academic/courses
- PUT    /api/academic/courses/{id}
- DELETE /api/academic/courses/{id}
- GET    /api/academic/courses/hierarchy

Course Types:
- GET    /api/academic/course-types
- POST   /api/academic/course-types
- PUT    /api/academic/course-types/{id}
- DELETE /api/academic/course-types/{id}

Course Groups:
- GET    /api/academic/course-groups
- POST   /api/academic/course-groups
- PUT    /api/academic/course-groups/{id}
- GET    /api/academic/course-groups/filter

Modules:
- GET    /api/academic/modules
- POST   /api/academic/modules
- PUT    /api/academic/modules/{id}
- DELETE /api/academic/modules/{id}

Subjects:
- GET    /api/academic/subjects
- POST   /api/academic/subjects
- PUT    /api/academic/subjects/{id}

Sections:
- GET    /api/academic/sections
- POST   /api/academic/sections
- PUT    /api/academic/sections/{id}

Topics:
- GET    /api/academic/topics
- POST   /api/academic/topics
- PUT    /api/academic/topics/{id}

Infrastructure:
- GET    /api/academic/infrastructure
- POST   /api/academic/infrastructure
- PUT    /api/academic/infrastructure/{id}

Premises:
- GET    /api/academic/premises
- POST   /api/academic/premises
- PUT    /api/academic/premises/{id}

Batch Cycles:
- GET    /api/academic/batch-cycles
- POST   /api/academic/batch-cycles
- PUT    /api/academic/batch-cycles/{id}

Dropdowns:
- GET    /api/academic/dropdowns/course-types
- GET    /api/academic/dropdowns/courses
- GET    /api/academic/dropdowns/modules
```

### **Scheduling Service** (Port: 8084)

**Responsibilities:**
- Class schedule management
- Session tracking (live and recorded)
- Timesheet management
- Time slot allocation
- Schedule conflict detection

**Key Features:**
- Real-time session management
- Recorded session storage and playback
- Timesheet approval workflow
- Topic-wise time tracking
- Schedule conflict validation
- Calendar integration

**API Endpoints:**
```
Schedule Management:
- GET    /api/scheduling/schedules
- POST   /api/scheduling/schedules
- PUT    /api/scheduling/schedules/{id}
- DELETE /api/scheduling/schedules/{id}
- GET    /api/scheduling/schedules/calendar

Session Management:
- GET    /api/scheduling/sessions
- POST   /api/scheduling/sessions
- PUT    /api/scheduling/sessions/{id}
- PATCH  /api/scheduling/sessions/{id}/status

Recorded Sessions:
- GET    /api/scheduling/recorded-sessions
- POST   /api/scheduling/recorded-sessions
- GET    /api/scheduling/recorded-sessions/{id}

Timesheet Management:
- GET    /api/scheduling/timesheets
- POST   /api/scheduling/timesheets
- PUT    /api/scheduling/timesheets/{id}
- GET    /api/scheduling/timesheets/my-entries
- POST   /api/scheduling/timesheets/approve
- POST   /api/scheduling/timesheets/verify

Time Slots:
- GET    /api/scheduling/time-slots
- POST   /api/scheduling/time-slots
- PUT    /api/scheduling/time-slots/{id}
```

### **Document Service** (Port: 8085)

**Responsibilities:**
- Document upload and storage
- Document retrieval and viewing
- Document metadata management

**Status:** In Development

## 📁 Project Structure

```
staff-portal-course-mgmt/
├── Backend/
│   ├── auth-service/              # OAuth2 Authorization Server
│   │   ├── src/main/java/com/staff_portal/auth_service/
│   │   │   ├── config/            # Security and OAuth2 configuration
│   │   │   ├── controller/        # Authentication endpoints
│   │   │   ├── model/             # User, Role, OAuth2 entities
│   │   │   ├── repository/        # JPA repositories
│   │   │   ├── service/           # Business logic
│   │   │   ├── security/          # UserDetailsService
│   │   │   └── util/              # JWT, password utilities
│   │   └── src/main/resources/
│   │       ├── application.yml
│   │       └── templates/         # Login, consent pages
│   │
│   ├── backend-for-frontend/      # BFF OAuth2 Client
│   │   ├── src/main/java/com/staff_portal/backend_for_frontend/
│   │   │   ├── config/            # OAuth2 client, Redis, CORS config
│   │   │   ├── controller/        # Login, session, proxy endpoints
│   │   │   ├── repository/        # Redis repositories
│   │   │   ├── security/          # OAuth2 handlers
│   │   │   ├── service/           # Proxy, token, state services
│   │   │   └── util/              # Cookie, Redis utilities
│   │   └── src/main/resources/
│   │       └── templates/         # Login, error pages
│   │
│   ├── api-gateway/               # Spring Cloud Gateway
│   │   ├── src/main/java/com/staff_portal/api_gateway/
│   │   │   ├── config/            # Gateway routes, security, JWT
│   │   │   ├── filter/            # Custom gateway filters
│   │   │   ├── service/           # Audience validation
│   │   │   └── util/              # JWT utilities
│   │   └── src/main/resources/
│   │       └── application.yml
│   │
│   ├── user-service/              # User Management
│   │   ├── src/main/java/com/staff_portal/user_service/
│   │   │   ├── config/            # Security configuration
│   │   │   ├── controller/        # REST controllers
│   │   │   ├── dto/               # Request/Response DTOs
│   │   │   ├── model/             # Staff, Student, Menu entities
│   │   │   ├── repository/        # JPA repositories
│   │   │   └── service/           # Business logic
│   │   └── src/main/resources/
│   │       └── application.yml
│   │
│   ├── academic-service/          # Course Management
│   │   ├── src/main/java/com/staff_portal/academic_service/
│   │   │   ├── controller/        # Course, Module, Subject controllers
│   │   │   ├── dto/               # Request/Response DTOs
│   │   │   ├── model/             # Academic entities
│   │   │   ├── repository/        # JPA repositories
│   │   │   ├── service/           # Business logic
│   │   │   └── exception/         # Custom exceptions
│   │   └── src/main/resources/
│   │       └── application.yml
│   │
│   ├── scheduling-service/        # Schedule & Timesheet
│   │   ├── src/main/java/com/staff_portal/scheduling_service/
│   │   │   ├── controller/        # Schedule, Session controllers
│   │   │   ├── dto/               # Request/Response DTOs
│   │   │   ├── model/             # Schedule, Session entities
│   │   │   ├── repository/        # JPA repositories
│   │   │   ├── service/           # Business logic
│   │   │   └── mapper/            # Entity-DTO mappers
│   │   └── src/main/resources/
│   │       └── application.yml
│   │
│   └── document-service/          # Document Management (In Dev)
│
└── Frontend/
    └── staff-portal-frontend/
        ├── src/
        │   ├── components/
        │   │   ├── features/
        │   │   │   ├── academic-management/     # Course, Module, Subject UI
        │   │   │   ├── auth-management/         # Session, Profile
        │   │   │   ├── dashboard/               # Dashboard widgets
        │   │   │   ├── documents/               # Document viewer/upload
        │   │   │   ├── infrastructure-management/ # Infrastructure UI
        │   │   │   ├── schedule-session-timesheet-management/ # Scheduling UI
        │   │   │   ├── sidebar/                 # Navigation sidebar
        │   │   │   ├── staff-management/        # Staff management UI
        │   │   │   ├── system-administration/   # Menu, role management
        │   │   │   └── users/                   # Student management
        │   │   └── layout/                      # Reusable UI components
        │   │       ├── buttons/
        │   │       ├── cards/
        │   │       ├── forms/
        │   │       ├── modals/
        │   │       ├── tables/
        │   │       └── skeletons/
        │   ├── store/
        │   │   ├── api/                         # RTK Query API slices
        │   │   ├── slices/                      # Redux slices
        │   │   └── selectors/                   # Redux selectors
        │   ├── routes/                          # React Router config
        │   ├── providers/                       # Context providers
        │   ├── hooks/                           # Custom React hooks
        │   └── utils/                           # Utility functions
        └── package.json
```

## 🚦 Getting Started

### Prerequisites

- **Java 21+**
- **Node.js 22+**
- **Docker & Docker Compose**
- **MySQL 8.x**
- **Redis 7.x**
- **Maven 3.8+**

### Authentication Flow

1. **Login Initiation:**
```http
GET http://bff-service/oauth2/authorization/{registrationId}
```

2. **Token Exchange (handled by BFF):**
```http
POST http://auth-service/oauth2/v1/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code={authorization_code}&
redirect_uri=http://bff-service/login/oauth2/code/{registrationId}&
client_id=staff-portal-client&
client_secret=secret
```

3. **API Request (via BFF):**
```http
GET http://bff-service/bff/apig/proxy/users/staff
Cookie: SESSION={session-id}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Future Scopes

1. Containerization of all backend services and frontend app.
2. Deploying the application into the cloud(aws or azure).
