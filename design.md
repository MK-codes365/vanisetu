![Icon](asset/icon.jpeg)

# HLLRB - System Design Document

## 1. System Architecture Overview

HLLRB follows a modern cloud-native architecture built on AWS services, implementing a serverless backend with a Progressive Web Application (PWA) frontend. The system is designed for high availability, scalability, and security while maintaining simplicity for rural users.

**Architecture Principles:**
- Microservices-based serverless architecture
- Event-driven communication patterns
- Separation of concerns across layers
- API-first design approach
- Security by design
- Scalability through managed services

## 2. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Rural Users  │  │   Admins     │  │  Gov Officials│              │
│  │ (Voice/Web)  │  │  (Dashboard) │  │  (Portal)     │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘              │
└─────────┼──────────────────┼──────────────────┼────────────────────┘
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼────────────────────┐
│         │         PRESENTATION LAYER          │                     │
│  ┌──────▼──────────────────────────────────────▼──────┐            │
│  │         React.js PWA (Tailwind CSS)                 │            │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐ │            │
│  │  │Voice Input │  │Doc Upload  │  │Status Track  │ │            │
│  │  │ Component  │  │ Component  │  │  Component   │ │            │
│  │  └────────────┘  └────────────┘  └──────────────┘ │            │
│  │         Web Speech API    Tesseract.js             │            │
│  └─────────────────────────┬───────────────────────────┘            │
│                            │ HTTPS/TLS                              │
│                   AWS Amplify Hosting                               │
└────────────────────────────┼───────────────────────────────────────┘
                             │
┌────────────────────────────┼───────────────────────────────────────┐
│                            │  API GATEWAY LAYER                     │
│                   ┌────────▼────────┐                               │
│                   │  Amazon API     │                               │
│                   │    Gateway      │                               │
│                   │  (REST APIs)    │                               │
│                   └────────┬────────┘                               │
│                            │                                        │
└────────────────────────────┼───────────────────────────────────────┘
                             │
┌────────────────────────────┼───────────────────────────────────────┐
│                  APPLICATION LAYER (AWS Lambda)                     │
│  ┌──────────────┬──────────┴────────┬──────────────┬─────────────┐ │
│  │              │                   │              │             │ │
│  ▼              ▼                   ▼              ▼             ▼ │
│ ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐       │
│ │ Auth   │  │Intent  │  │Document│  │Service │  │Status  │       │
│ │Service │  │Detector│  │Processor│ │Router  │  │Manager │       │
│ └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘       │
│     │           │            │           │           │            │
└─────┼───────────┼────────────┼───────────┼───────────┼────────────┘
      │           │            │           │           │
┌─────┼───────────┼────────────┼───────────┼───────────┼────────────┐
│     │           │   AI LAYER │           │           │            │
│     │      ┌────▼────────────▼───┐       │           │            │
│     │      │  Amazon Bedrock     │       │           │            │
│     │      │   (Vani Setu)       │       │           │            │
│     │      │ - NLU               │       │           │            │
│     │      │ - Intent Detection  │       │           │            │
│     │      │ - Entity Extraction │       │           │            │
│     │      └─────────────────────┘       │           │            │
└─────┼─────────────────────────────────────┼───────────┼────────────┘
      │                                     │           │
┌─────┼─────────────────────────────────────┼───────────┼────────────┐
│     │            DATA LAYER               │           │            │
│  ┌──▼──────┐  ┌──────────┐  ┌────────────▼───────────▼─────┐     │
│  │Amazon   │  │ Amazon   │  │      Amazon DynamoDB          │     │
│  │Cognito  │  │   S3     │  │  ┌──────┐ ┌──────┐ ┌──────┐  │     │
│  │(Auth)   │  │(Docs)    │  │  │Users │ │Apps  │ │Logs  │  │     │
│  └─────────┘  └──────────┘  │  └──────┘ └──────┘ └──────┘  │     │
│                              └──────────────────────────────┘     │
└───────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼───────────────────────────────────────┐
│                 MONITORING & LOGGING LAYER                         │
│                   ┌────────▼────────┐                              │
│                   │   CloudWatch    │                              │
│                   │ - Logs          │                              │
│                   │ - Metrics       │                              │
│                   │ - Alarms        │                              │
│                   └─────────────────┘                              │
└───────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼───────────────────────────────────────┐
│              EXTERNAL INTEGRATION LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Government   │  │   Payment    │  │    SMS       │            │
│  │ Service APIs │  │   Gateway    │  │  Gateway     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└───────────────────────────────────────────────────────────────────┘
```

## 3. Component Description

### 3.1 Frontend Layer

**Technology:** React.js with Progressive Web App capabilities

**Components:**

**Voice Input Module**
- Captures user voice using Web Speech API
- Implements push-to-talk and continuous listening modes
- Provides real-time transcription feedback
- Handles audio preprocessing and noise cancellation
- Supports multiple Indian languages

**Document Upload Module**
- Camera integration for document capture
- Image quality validation and enhancement
- Client-side image compression
- Preview and retake functionality
- Progress indication for uploads

**Service Selection Module**
- Voice-guided service discovery
- Visual service catalog with icons
- Eligibility checker
- Form pre-filling from voice/OCR data

**Status Tracking Module**
- Real-time application status display
- Timeline visualization
- Push notification handling
- Voice-based status inquiry

**Offline Support**
- Service Worker for caching
- IndexedDB for local storage
- Background sync for queued requests
- Offline indicator

### 3.2 Backend Layer (AWS Lambda Functions)

**Authentication Service**
- User registration and login
- OTP generation and validation
- Session management
- Token refresh mechanism
- Integration with Amazon Cognito

**Intent Detection Service**
- Receives voice transcription
- Calls Amazon Bedrock for NLU
- Maps intent to service categories
- Extracts entities (name, dates, IDs)
- Returns structured intent object

**Document Processing Service**
- Receives uploaded images
- Performs OCR using Tesseract.js
- Validates document type
- Extracts key fields
- Stores documents in S3
- Returns extracted data

**Service Router**
- Routes requests to government APIs
- Handles API authentication
- Implements retry logic
- Manages rate limiting
- Transforms data formats
- Generates application IDs

**Status Management Service**
- Tracks application lifecycle
- Updates status in DynamoDB
- Triggers notifications
- Maintains audit logs
- Provides status query API

**Notification Service**
- Sends push notifications
- SMS integration
- Email notifications
- Event-driven triggers

**Admin Service**
- Dashboard data aggregation
- Analytics computation
- Report generation
- User management APIs

### 3.3 AI Layer (Amazon Bedrock - Vani Setu)

**Natural Language Understanding**
- Processes voice transcriptions in regional languages
- Understands conversational context
- Handles code-mixed language (Hindi-English, etc.)

**Intent Classification**
- Identifies user's service request intent
- Supports 50+ government service categories
- Provides confidence scores
- Handles multi-intent queries

**Entity Extraction**
- Extracts person names, dates, locations
- Identifies document numbers (Aadhaar, PAN)
- Recognizes service-specific entities
- Validates extracted data format

**Dialogue Management**
- Maintains conversation context
- Generates clarifying questions
- Handles slot filling for incomplete information
- Provides conversational responses

### 3.4 Database Layer (Amazon DynamoDB)

**Users Table**
- Stores user profiles and preferences
- Linked identity documents
- Language preferences
- Contact information

**Applications Table**
- Application records with status
- Service type and details
- Timestamps and audit trail
- Document references

**Services Catalog Table**
- Available government services
- Eligibility criteria
- Required documents
- API endpoints

**Audit Logs Table**
- User actions
- System events
- API calls
- Error logs

### 3.5 Storage Layer (Amazon S3)

**Document Storage**
- Encrypted document storage
- Versioning enabled
- Lifecycle policies for archival
- Organized by user ID and application ID

**Static Assets**
- Frontend application files
- Images and icons
- Language resources

### 3.6 Authentication (Amazon Cognito)

**User Pools**
- Mobile number-based authentication
- OTP verification
- User attribute management
- Password policies

**Identity Pools**
- Temporary AWS credentials
- Role-based access control
- Federated identity support

## 4. Data Flow Design

### 4.1 User Registration Flow

```
User → Frontend → API Gateway → Auth Lambda → Cognito
                                      ↓
                                  DynamoDB (Users)
                                      ↓
                                SMS Gateway (OTP)
                                      ↓
User ← Frontend ← API Gateway ← Auth Lambda
```

### 4.2 Voice-Based Service Request Flow

```
1. User speaks → Web Speech API → Text transcription
2. Frontend → API Gateway → Intent Detection Lambda
3. Intent Lambda → Amazon Bedrock → NLU Processing
4. Bedrock returns intent + entities
5. Intent Lambda → Service Router Lambda
6. Service Router → DynamoDB (check eligibility)
7. Service Router → Frontend (request additional info if needed)
8. User provides documents → Document Processing Lambda
9. Document Lambda → Tesseract.js (OCR)
10. Document Lambda → S3 (store document)
11. Document Lambda → DynamoDB (save metadata)
12. Service Router → Government API (submit application)
13. Service Router → DynamoDB (save application)
14. Status Manager → Notification Service
15. Frontend ← Application ID and confirmation
```

### 4.3 Status Tracking Flow

```
User query → Frontend → API Gateway → Status Lambda
                                          ↓
                                      DynamoDB (Applications)
                                          ↓
Frontend ← API Gateway ← Status Lambda (return status)
```

### 4.4 Admin Dashboard Data Flow

```
Admin → Frontend → API Gateway → Admin Lambda
                                      ↓
                                  DynamoDB (aggregate queries)
                                      ↓
                                  CloudWatch (metrics)
                                      ↓
Frontend ← API Gateway ← Admin Lambda (analytics data)
```

## 5. API Design

### 5.1 Authentication APIs

**POST /api/auth/register**
```json
Request:
{
  "phoneNumber": "+919876543210",
  "name": "User Name",
  "language": "hi"
}

Response:
{
  "userId": "usr_123456",
  "otpSent": true,
  "message": "OTP sent to mobile"
}
```

**POST /api/auth/verify-otp**
```json
Request:
{
  "phoneNumber": "+919876543210",
  "otp": "123456"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

### 5.2 Intent Detection APIs

**POST /api/intent/detect**
```json
Request:
{
  "text": "मुझे राशन कार्ड बनवाना है",
  "language": "hi",
  "userId": "usr_123456"
}

Response:
{
  "intent": "RATION_CARD_APPLICATION",
  "confidence": 0.95,
  "entities": {
    "serviceType": "ration_card",
    "action": "new_application"
  },
  "requiredDocuments": ["aadhaar", "address_proof"],
  "nextStep": "document_upload"
}
```

### 5.3 Document Processing APIs

**POST /api/documents/upload**
```json
Request: (multipart/form-data)
{
  "file": <binary>,
  "documentType": "aadhaar",
  "userId": "usr_123456"
}

Response:
{
  "documentId": "doc_789012",
  "extractedData": {
    "name": "User Name",
    "aadhaarNumber": "XXXX-XXXX-1234",
    "address": "..."
  },
  "confidence": 0.92,
  "s3Url": "s3://bucket/path/to/doc"
}
```

### 5.4 Application APIs

**POST /api/applications/submit**
```json
Request:
{
  "userId": "usr_123456",
  "serviceType": "ration_card",
  "documents": ["doc_789012", "doc_789013"],
  "formData": {
    "name": "User Name",
    "address": "...",
    "familyMembers": 4
  }
}

Response:
{
  "applicationId": "app_345678",
  "status": "submitted",
  "referenceNumber": "RC2026021500123",
  "estimatedCompletionDays": 15,
  "message": "आपका आवेदन सफलतापूर्वक जमा हो गया है"
}
```

**GET /api/applications/{applicationId}/status**
```json
Response:
{
  "applicationId": "app_345678",
  "status": "under_review",
  "timeline": [
    {
      "stage": "submitted",
      "timestamp": "2026-02-15T10:30:00Z",
      "message": "Application submitted"
    },
    {
      "stage": "document_verification",
      "timestamp": "2026-02-15T14:20:00Z",
      "message": "Documents verified"
    },
    {
      "stage": "under_review",
      "timestamp": "2026-02-16T09:00:00Z",
      "message": "Application under review"
    }
  ],
  "nextAction": null
}
```

### 5.5 Admin APIs

**GET /api/admin/analytics**
```json
Request Parameters:
?startDate=2026-02-01&endDate=2026-02-15&metric=applications

Response:
{
  "totalApplications": 1250,
  "byStatus": {
    "submitted": 320,
    "under_review": 450,
    "approved": 380,
    "rejected": 100
  },
  "byService": {
    "ration_card": 500,
    "pension": 350,
    "birth_certificate": 400
  },
  "byLanguage": {
    "hindi": 600,
    "tamil": 350,
    "bengali": 300
  }
}
```

## 6. Database Schema

### 6.1 Users Table (DynamoDB)

```
Table Name: hllrb-users
Partition Key: userId (String)

Attributes:
- userId: String (PK)
- phoneNumber: String (GSI)
- name: String
- email: String (optional)
- language: String
- createdAt: Number (timestamp)
- updatedAt: Number (timestamp)
- aadhaarLinked: Boolean
- profileComplete: Boolean
- lastLoginAt: Number
```

### 6.2 Applications Table (DynamoDB)

```
Table Name: hllrb-applications
Partition Key: applicationId (String)
Sort Key: createdAt (Number)

Global Secondary Index: userId-createdAt-index
- Partition Key: userId
- Sort Key: createdAt

Attributes:
- applicationId: String (PK)
- userId: String (GSI PK)
- createdAt: Number (SK, GSI SK)
- updatedAt: Number
- serviceType: String
- status: String
- referenceNumber: String
- formData: Map
- documents: List<String>
- timeline: List<Map>
- governmentResponse: Map
- estimatedCompletion: Number
```

### 6.3 Documents Table (DynamoDB)

```
Table Name: hllrb-documents
Partition Key: documentId (String)

Global Secondary Index: userId-uploadedAt-index
- Partition Key: userId
- Sort Key: uploadedAt

Attributes:
- documentId: String (PK)
- userId: String (GSI PK)
- uploadedAt: Number (GSI SK)
- documentType: String
- s3Key: String
- s3Bucket: String
- extractedData: Map
- ocrConfidence: Number
- verified: Boolean
- applicationId: String (optional)
```

### 6.4 Services Catalog Table (DynamoDB)

```
Table Name: hllrb-services
Partition Key: serviceId (String)

Attributes:
- serviceId: String (PK)
- serviceName: Map (multilingual)
- category: String
- description: Map (multilingual)
- requiredDocuments: List<String>
- eligibilityCriteria: Map
- apiEndpoint: String
- estimatedDays: Number
- active: Boolean
```

### 6.5 Audit Logs Table (DynamoDB)

```
Table Name: hllrb-audit-logs
Partition Key: logId (String)
Sort Key: timestamp (Number)

Global Secondary Index: userId-timestamp-index
- Partition Key: userId
- Sort Key: timestamp

Attributes:
- logId: String (PK)
- timestamp: Number (SK)
- userId: String (GSI PK)
- action: String
- resource: String
- ipAddress: String
- userAgent: String
- requestId: String
- statusCode: Number
- errorMessage: String (optional)
```

## 7. Security Design

### 7.1 Authentication & Authorization

- Multi-factor authentication using OTP
- JWT-based session management with short expiry (1 hour)
- Refresh token rotation
- Role-based access control (User, Admin, Government Official)
- API key authentication for government service integrations

### 7.2 Data Protection

**Encryption at Rest:**
- DynamoDB encryption using AWS KMS
- S3 bucket encryption (AES-256)
- Encrypted EBS volumes for Lambda execution

**Encryption in Transit:**
- TLS 1.3 for all API communications
- HTTPS-only frontend hosting
- VPC endpoints for AWS service communication

**Data Masking:**
- PII masking in logs (Aadhaar, phone numbers)
- Document preview with sensitive data redacted
- Secure document URLs with time-limited signed URLs

### 7.3 API Security

- API Gateway throttling (1000 requests/second per user)
- Rate limiting per IP address
- Request validation and input sanitization
- CORS configuration for allowed origins
- API key rotation policy

### 7.4 Application Security

- Content Security Policy (CSP) headers
- XSS protection
- CSRF token validation
- SQL injection prevention (NoSQL)
- Dependency vulnerability scanning
- Regular security audits

### 7.5 Compliance

- Data residency in Indian data centers
- GDPR-like data protection measures
- Right to data deletion
- Consent management
- Audit trail for all data access

## 8. Deployment Architecture

### 8.1 Environment Strategy

**Development Environment**
- Separate AWS account
- Reduced resource allocation
- Mock external integrations
- Debug logging enabled

**Staging Environment**
- Production-like configuration
- Integration with test government APIs
- Performance testing
- UAT environment

**Production Environment**
- Multi-AZ deployment
- Auto-scaling enabled
- Production monitoring
- Disaster recovery setup

### 8.2 CI/CD Pipeline

```
Code Commit → GitHub
     ↓
GitHub Actions (CI)
     ↓
Build & Test
     ↓
Security Scan
     ↓
AWS Amplify (Frontend)
AWS Lambda (Backend)
     ↓
Staging Deployment
     ↓
Automated Tests
     ↓
Manual Approval
     ↓
Production Deployment
     ↓
Health Checks
     ↓
Rollback (if needed)
```

### 8.3 Infrastructure as Code

- AWS CloudFormation templates
- Terraform for multi-cloud compatibility
- Version-controlled infrastructure
- Automated provisioning

### 8.4 Deployment Regions

- Primary: ap-south-1 (Mumbai)
- Secondary: ap-south-2 (Hyderabad) - DR
- CloudFront for global CDN

## 9. Error Handling Strategy

### 9.1 Frontend Error Handling

- User-friendly error messages in local language
- Retry mechanism for network failures
- Offline queue for failed requests
- Error boundary components
- Graceful degradation

### 9.2 Backend Error Handling

**Lambda Error Handling:**
- Try-catch blocks for all operations
- Structured error responses
- Dead Letter Queues (DLQ) for failed events
- Exponential backoff for retries

**API Gateway Error Responses:**
```json
{
  "error": {
    "code": "INTENT_DETECTION_FAILED",
    "message": "Unable to understand request",
    "messageLocal": "आपका अनुरोध समझ नहीं आया",
    "requestId": "req_123456",
    "timestamp": "2026-02-15T10:30:00Z"
  }
}
```

### 9.3 Error Categories

- 4xx Client Errors: Invalid input, authentication failures
- 5xx Server Errors: Service unavailable, timeout
- Custom Errors: Intent detection failure, OCR failure

### 9.4 Monitoring & Alerting

- CloudWatch alarms for error rates
- SNS notifications for critical errors
- Error dashboards
- On-call rotation for incident response

## 10. Scalability Strategy

### 10.1 Horizontal Scaling

**Lambda Functions:**
- Concurrent execution limits configured
- Reserved concurrency for critical functions
- Provisioned concurrency for low latency

**DynamoDB:**
- On-demand capacity mode
- Auto-scaling for provisioned capacity
- Global tables for multi-region

**S3:**
- Unlimited storage capacity
- Transfer acceleration for uploads
- CloudFront caching

### 10.2 Caching Strategy

**Frontend Caching:**
- Service Worker caching
- Browser cache for static assets
- IndexedDB for user data

**Backend Caching:**
- API Gateway caching (TTL: 5 minutes)
- DynamoDB DAX for read-heavy tables
- CloudFront edge caching

### 10.3 Database Optimization

- Efficient partition key design
- GSI for query patterns
- Batch operations for bulk writes
- DynamoDB Streams for event processing

### 10.4 Load Testing

- Simulate 10,000 concurrent users
- Stress testing for peak loads
- Endurance testing for 24-hour runs
- Identify bottlenecks

### 10.5 Cost Optimization

- Lambda memory optimization
- S3 lifecycle policies for archival
- Reserved capacity for predictable workloads
- CloudWatch log retention policies

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 15, 2026 | CodeX4 Team | Initial design document |

**Review & Approval**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Solution Architect | | | |
| Technical Lead | | | |
| Security Architect | | | |
| DevOps Lead | | | |
