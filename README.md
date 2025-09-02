# Staff Portal Course Management System

A comprehensive course management platform built with a microservices architecture, implementing modern security patterns and resilient design principles.

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
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │ User Service │ │   Academic   │ │ Scheduling   │
        │ (Resource    │ │   Service    │ │   Service    │
        │  Server)     │ │ (Resource    │ │ (Resource    │
        │              │ │  Server)     │ │  Server)     │
        └──────────────┘ └──────────────┘ └──────────────┘
```

## 🚀 Technology Stack

### **Backend Services**
- **Spring Boot** - Microservices framework
- **Spring Security** - OAuth 2.1 + OIDC implementation
- **Spring WebMVC** - REST API development
- **Resilience4j** - Circuit breaker and resilience patterns

### **Security Framework**
- **OAuth 2.1** - Modern authorization framework
- **OpenID Connect (OIDC)** - Identity layer
- **JWT Tokens** - Stateless authentication

### **Infrastructure**
- **Docker** - Containerization
- **MySQL** - Database
- **Redis** 

## 🔐 Security Architecture

### **OAuth 2.1 + OIDC Flow**
1. **Frontend** initiates login via BFF
2. **BFF** redirects to Auth Service (Authorization Server)
3. **User** authenticates and consents
4. **Auth Service** returns authorization code to BFF
5. **BFF** exchanges code for access/refresh tokens
6. **Frontend** receives session cookie from BFF
7. **API calls** go through BFF → API Gateway with JWT validation

### **Service Roles**
- **Auth Service**: Issues and validates JWT tokens
- **BFF**: OAuth2 Client, handles token management
- **API Gateway**: OAuth2 Resource Server, validates tokens
- **Backend Services**: Protected resources

## 🏛️ Service Architecture

### **API Gateway**
- **Centralized Entry Point** for all microservices
- **JWT Token Validation** with audience enforcement
- **Request Routing** based on URL patterns
- **Resilience Patterns**: Circuit breaker, retry, timeout
- **Cross-cutting Concerns**: Logging, monitoring, error handling

### **User Service**
- User profile management
- Frontend Component Role-Based Access Management
- Student Management

### **Academic Service**
- Batch Cycle, Premise, Infrastructure Management
- Course Types, Courses, Module, Subject, Section, Topic Management
- Course Group Management

### **Scheduling Service**
- Class scheduling
- Online Session management
