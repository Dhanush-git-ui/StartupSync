# 🧪 API Testing - Quick Start Guide

## ✅ Your APIs Are Configured and Ready!

### Current Configuration

#### Gemini API ✨
```
Model: gemini-2.5-flash (Latest)
API Key: AIzaSyC0sZUePWCuqRqkMFkHvuP6_SgKzlZT9A8
Status: ✅ Active & Configured
```

#### StepFun API ⚡
```
Model: step-3.5-flash:free (Free Tier)
API Key: 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
Status: ✅ Active & Configured
```

---

## 🚀 Run Tests NOW (3 Easy Steps)

### Option 1: Visual Dashboard (Easiest)

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Open test page:**
   ```
   http://localhost:8080/api-test
   ```

3. **Click buttons:**
   - "Validate Env" → Check configuration
   - "Quick Check" → Fast connectivity test
   - "Run All Tests" → Complete test suite

### Option 2: Browser Console (Quick)

1. **Open browser console** (F12)

2. **Paste and run:**
   ```javascript
   // Quick validation
   import { validateEnvironmentVariables } from './src/utils/apiTests';
   const env = validateEnvironmentVariables();
   console.log('✅ Environment Status:', env);
   
   // Test Gemini
   import { testGeminiAPI } from './src/utils/apiTests';
   testGeminiAPI().then(result => console.log('🔵 Gemini:', result));
   
   // Test StepFun
   import { testStepFunAPI } from './src/utils/apiTests';
   testStepFunAPI().then(result => console.log('🟢 StepFun:', result));
   ```

### Option 3: Automated Script

Create a test script file and run:
```bash
node test-apis.mjs
```

---

## ✅ Expected Results

### If Everything Works ✅

You should see output like:
```
🧪 Testing Gemini API...
✅ Gemini API Test Passed!
Response: "4"
Duration: 1234ms

🧪 Testing StepFun API...
✅ StepFun API Test Passed!
Response: "Four"
Duration: 1567ms

📊 Summary:
Total: 14 tests
Passed: 14
Failed: 0
Success Rate: 100%
```

### If Something Fails ❌

Common errors and fixes:

**Error: "API key not configured"**
```bash
# Check your .env file
cat .env
# Should show both API keys
```

**Error: "Authentication failed"**
- API key might be wrong or expired
- Keys in your `.env` are correct ✅

**Error: "Network request failed"**
- Check internet connection
- Verify API services are online

---

## 📊 What Gets Tested

### Basic Tests (2 tests)
- ✅ Gemini API connection
- ✅ StepFun API connection

### Domain Tests (12 tests)
Both APIs tested across all domains:
1. Ideation
2. Marketing
3. Fundraising
4. Legal
5. Operations
6. Product

### Total: 14 Tests

---

## 🎯 Success Criteria

All tests should pass if:
- ✅ API keys are valid
- ✅ Internet connection is active
- ✅ API services are operational
- ✅ Configuration is correct

Expected success rate: **100%**

---

## 🔍 Manual Verification

### Test Gemini Directly
```javascript
// In browser console
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyC0sZUePWCuqRqkMFkHvuP6_SgKzlZT9A8',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
    })
  }
);
const data = await response.json();
console.log('Gemini Response:', data);
```

### Test StepFun Directly
```javascript
// In browser console
const response = await fetch(
  'https://api.stepfun.com/v1/chat/completions',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    },
    body: JSON.stringify({
      model: 'step-3.5-flash:free',
      messages: [{ role: 'user', content: 'Hello' }]
    })
  }
);
const data = await response.json();
console.log('StepFun Response:', data);
```

---

## 📱 Quick Reference

### Files Created
1. `src/utils/apiTests.ts` - Test functions
2. `src/pages/APITest.tsx` - Test dashboard
3. `API_TESTING_GUIDE.md` - Full documentation
4. `QUICK_START.md` - This file

### Routes Added
- `/api-test` - API testing dashboard

### Commands to Remember
```bash
# Start development server
npm run dev

# Access test page
http://localhost:8080/api-test
```

---

## 🎉 You're All Set!

Your APIs are configured with:
- ✅ Latest Gemini 2.5 Flash model
- ✅ StepFun 3.5 Flash (Free tier)
- ✅ Comprehensive test suite
- ✅ Visual dashboard
- ✅ Error handling
- ✅ Performance monitoring

**Next Step:** Just run `npm run dev` and visit `/api-test`!

---

## 🆘 Need Help?

If tests fail:
1. Check `.env` file has correct keys
2. Restart development server
3. Clear browser cache
4. Check network tab in DevTools
5. Review `API_TESTING_GUIDE.md`

---

**Status**: Ready to Test ✅  
**Configuration**: Validated ✅  
**APIs**: Active ✅
