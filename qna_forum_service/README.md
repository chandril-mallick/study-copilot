# Dabba AI Q&A Forum Service

A scalable, standalone Q&A forum service for educational communities. This service can run independently and be integrated with the main Dabba AI application when needed.

## Features

- ✅ Complete Q&A functionality (questions, answers, voting)
- ✅ Subject-based categorization
- ✅ Tag system for better organization
- ✅ Guest user support (no authentication required initially)
- ✅ RESTful API with comprehensive endpoints
- ✅ SQLite database (easily switchable to PostgreSQL/MySQL)
- ✅ CORS support for frontend integration
- ✅ Future-ready authentication system
- ✅ Comprehensive API documentation

## Quick Start

### 1. Setup

```bash
cd qna_forum_service
pip install -r requirements.txt
cp .env.example .env  # Optional: configure environment variables
```
cd qna_forum_service
pip install -r requirements.txt
python3 main.py

### 2. Run the Service

```bash
python3 main.py
```

The service will start on `http://localhost:8001`

### 3. API Documentation

Visit `http://localhost:8001/docs` for interactive API documentation.

## API Endpoints

### Questions
- `GET /api/qna/questions` - List questions with filtering
- `POST /api/qna/questions` - Create a new question
- `GET /api/qna/questions/{id}` - Get specific question
- `DELETE /api/qna/questions/{id}` - Delete question

### Answers
- `POST /api/qna/questions/{id}/answers` - Add answer to question
- `DELETE /api/qna/answers/{id}` - Delete answer

### Voting
- `POST /api/qna/questions/{id}/vote` - Vote on question
- `POST /api/qna/answers/{id}/vote` - Vote on answer
- `POST /api/qna/answers/{id}/accept` - Accept answer

### Utilities
- `GET /api/qna/tags` - Get all tags
- `GET /api/qna/subjects` - Get all subjects

## Database Schema

The service uses SQLAlchemy with the following models:
- **Users** - User management (guest support initially)
- **Questions** - Q&A questions
- **Answers** - Answers to questions
- **Tags** - Tag system for categorization
- **Votes** - Voting system for questions and answers

## Frontend Integration

The existing frontend Q&A forum component can be easily connected to this API by:

1. **Update API calls** in `/frontend/src/components/QnAForum.jsx`:
```javascript
const API_BASE_URL = 'http://localhost:8001/api/qna'

// Replace mock data with API calls
const response = await axios.get(`${API_BASE_URL}/questions`);
```

2. **Update environment configuration**:
```javascript
// Add to frontend environment or config
VITE_QNA_API_URL=http://localhost:8001/api/qna
```

## Scaling for Production

### Database
- Switch to PostgreSQL/MySQL by updating `DATABASE_URL`
- Add database migrations with Alembic
- Configure connection pooling

### Authentication
- Enable JWT authentication by implementing auth endpoints
- Connect with existing user system
- Add user sessions and permissions

### Deployment
- Docker containerization
- Load balancing
- CDN integration
- Monitoring and logging

### Performance
- Add caching (Redis)
- Database indexing
- API rate limiting
- Background task processing

## Integration with Main Application

To integrate with the main Dabba AI application:

1. **Add to main.py** (when ready):
```python
from routes.qna_forum import router as qna_forum_router
app.include_router(qna_forum_router)
```

2. **Update frontend routing**:
```javascript
// In App.jsx, update the qna-forum route
{activeTab === 'qna-forum' && (
  <QnAForum apiBaseUrl="/api/qna" />
)}
```

3. **Database migration**:
   - Export data from SQLite
   - Import to main application database
   - Update foreign key references

## Development

### Adding New Features
- Add new models to `models.py`
- Create/update routes in `routes.py`
- Update API documentation
- Test with frontend component

### Testing
```bash
# Install test dependencies
pip install pytest httpx

# Run tests
pytest tests/
```

## Security Considerations

- Implement proper authentication before production
- Add input validation and sanitization
- Configure CORS properly
- Use HTTPS in production
- Add rate limiting
- Implement content moderation

## License

This service is part of the Dabba AI project.
