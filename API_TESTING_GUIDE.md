# 🔬 API Testing Guide - StartupSync

## ✅ Updated API Configurations

### Gemini API
- **Model**: `gemini-2.5-flash` (Latest)
- **API Key**: `AIzaSyC0sZUePWCuqRqkMFkHvuP6_SgKzlZT9A8`
- **Status**: ✅ Configured
- **Endpoint**: Google Generative Language API v1beta

### StepFun API
- **Model**: `step-3.5-flash:free` (Free Tier)
- **API Key**: `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`
- **Status**: ✅ Configured
- **Endpoint**: StepFun Chat Completions API

---

## 🚀 How to Run Tests

### Method 1: Using the Test Dashboard (Recommended)

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Navigate to Test Page**
   - Open browser: `http://localhost:8080/api-test`
   - Or click "API Test" in navigation (if added to menu)

3. **Run Tests**
   - Click "Validate Env" to check configuration
   - Click "Quick Check" for fast connectivity test
   - Click "Run All Tests" for comprehensive testing

### Method 2: Console Testing

Open browser console and run:

```javascript
// Import test functions
import { 
  runAllAPITests, 
  testGeminiAPI, 
  testStepFunAPI,
  validateEnvironmentVariables 
} from './src/utils/apiTests';

// Validate environment
const validation = validateEnvironmentVariables();
console.log('Environment Status:', validation);

// Run quick tests
testGeminiAPI().then(console.log);
testStepFunAPI().then(console.log);

// Run comprehensive suite
runAllAPITests().then(console.log);
```

---

## 📊 Available Test Functions

### 1. Environment Validation
```typescript
validateEnvironmentVariables()
```
**Checks:**
- API key presence
- API key format
- Configuration warnings

**Returns:**
```json
{
  "valid": true/false,
  "errors": ["error messages"],
  "warnings": ["warnings"]
}
```

### 2. Gemini API Test
```typescript
testGeminiAPI()
```
**Tests:**
- Basic connectivity
- Authentication
- Response generation
- Performance metrics

**Returns:**
```json
{
  "success": true/false,
  "api": "Gemini",
  "testName": "Basic Connection Test",
  "response": "API response text",
  "timestamp": "2025-01-XX...",
  "duration": 1234
}
```

### 3. StepFun API Test
```typescript
testStepFunAPI()
```
**Tests:**
- Basic connectivity
- Authentication
- Response generation
- Performance metrics

**Returns:** Same structure as Gemini test

### 4. Domain-Specific Tests
```typescript
testDomainResponses(domain: StartupDomain)
```
**Tests all domains:**
- `ideation`
- `marketing`
- `fundraising`
- `legal`
- `operations`
- `product`

**Returns:** Array of test results for both APIs

### 5. Comprehensive Test Suite
```typescript
runAllAPITests()
```
**Runs:**
- Both API connection tests
- All 6 domain tests (12 total)
- Performance benchmarks
- Response validation

**Returns:**
```json
{
  "summary": {
    "total": 14,
    "passed": 14,
    "failed": 0,
    "successRate": 100
  },
  "results": [...]
}
```

### 6. Health Check
```typescript
performHealthCheck()
```
**Quick verification of:**
- Gemini API status
- StepFun API status
- Overall system health

**Returns:**
```json
{
  "healthy": true/false,
  "geminiHealthy": true/false,
  "stepfunHealthy": true/false,
  "details": [...]
}
```

---

## ✅ Expected Results

### Successful Test Output

```
🚀 Starting Comprehensive API Tests...

🧪 Testing Gemini API...
✅ Gemini API Test Passed! { response: '4', duration: 1234 }

🧪 Testing StepFun API...
✅ StepFun API Test Passed! { response: '4', duration: 1567 }

🧪 Testing ideation domain responses...
🧪 Testing marketing domain responses...
...

📊 Test Results Summary:
==================================================
Total Tests: 14
✅ Passed: 14
❌ Failed: 0
📈 Success Rate: 100.0%
==================================================

📋 Detailed Results:
1. ✅ [Gemini] Basic Connection Test - PASS
   ⏱️ Duration: 1234ms
   💬 Response: 4

2. ✅ [StepFun] Basic Connection Test - PASS
   ⏱️ Duration: 1567ms
   💬 Response: Four
...
```

### Error Scenarios

#### Invalid API Key
```json
{
  "success": false,
  "error": "Authentication failed. Please check your API key."
}
```

#### Rate Limit Exceeded
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later."
}
```

#### Network Error
```json
{
  "success": false,
  "error": "Failed to fetch"
}
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. "API key not configured" Error
**Solution:**
```bash
# Check .env file exists
cat .env

# Verify API keys are present
VITE_GEMINI_API_KEY=AIzaSyC0sZUePWCuqRqkMFkHvuP6_SgKzlZT9A8
VITE_STEPFUN_API_KEY=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
```

#### 2. Authentication Failed
**Possible Causes:**
- API key expired
- Incorrect key format
- API service disabled

**Solution:**
1. Regenerate API keys from provider consoles
2. Update `.env` file
3. Restart development server

#### 3. CORS Errors
**Solution:**
- These APIs support client-side calls
- Ensure using HTTPS endpoints
- Check browser console for details

#### 4. Timeout Errors
**Solution:**
- Check internet connection
- Verify API service status
- Increase timeout in API configuration

---

## 📈 Performance Benchmarks

### Expected Response Times

| API | Good | Average | Slow |
|-----|------|---------|------|
| Gemini | < 1s | 1-2s | > 2s |
| StepFun | < 1.5s | 1.5-3s | > 3s |

### Token Usage

**Gemini 2.5 Flash:**
- Input: ~100 tokens per test
- Output: ~50 tokens per test
- Cost: Very economical

**StepFun 3.5 Flash (Free):**
- Input: ~100 tokens per test
- Output: ~50 tokens per test
- Cost: Free tier

---

## 🎯 Test Coverage

### Functional Tests
- ✅ API connectivity
- ✅ Authentication
- ✅ Request/Response cycle
- ✅ Error handling
- ✅ Domain-specific queries
- ✅ Concise mode functionality

### Integration Tests
- ✅ Environment variable loading
- ✅ Model selection
- ✅ Parameter passing
- ✅ Response parsing

### Performance Tests
- ✅ Response time measurement
- ✅ Concurrent request handling
- ✅ Error recovery

---

## 🔐 Security Notes

### API Key Safety
- ✅ Keys stored in `.env` (not committed to git)
- ✅ Client-side only exposure (intentional for this app)
- ⚠️ For production, use backend proxy

### Best Practices
1. Never commit `.env` file
2. Use `.env.example` as template
3. Rotate keys periodically
4. Monitor usage quotas
5. Set up billing alerts

---

## 📝 Manual Testing Checklist

### Before Production
- [ ] All API tests pass
- [ ] Response times acceptable
- [ ] Error messages user-friendly
- [ ] No console errors
- [ ] API keys valid and active
- [ ] Rate limits understood
- [ ] Costs calculated

### Regular Maintenance
- [ ] Weekly API health checks
- [ ] Monthly key rotation
- [ ] Quarterly performance review
- [ ] Usage monitoring active

---

## 🎓 Learning Resources

### Gemini API Documentation
- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Reference](https://ai.google.dev/docs)
- [Model Versions](https://ai.google.dev/models/gemini)

### StepFun API Documentation
- [StepFun Platform](https://platform.stepfun.com/)
- [API Reference](https://docs.stepfun.com/)
- [Model Information](https://stepfun.com/models)

---

## 📞 Support

If tests fail consistently:
1. Check API provider status pages
2. Verify account/billing status
3. Review API documentation
4. Contact provider support
5. Check community forums

---

**Last Updated**: Current Session  
**Test Framework Version**: 1.0.0  
**Status**: Ready for Testing ✅
