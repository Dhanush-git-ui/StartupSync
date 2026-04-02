/**
 * API Testing Utility for StartupSync
 * Tests Gemini and StepFun API connections and responses
 */

import { getGeminiResponse, StartupDomain, OutputFormat } from './geminiApi';
import { getStepFunResponse } from './stepfunApi';

export interface TestResult {
  success: boolean;
  api: 'Gemini' | 'StepFun';
  testName: string;
  response?: string;
  error?: string;
  timestamp: Date;
  duration?: number;
}

/**
 * Test Gemini API connection with a simple query
 */
export async function testGeminiAPI(): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    console.log('🧪 Testing Gemini API...');
    
    const { response, structuredOutput } = await getGeminiResponse(
      'What is 2 + 2? Answer in one word.',
      'ideation',
      'text',
      true // concise mode for quick test
    );
    
    const duration = Date.now() - startTime;
    
    // Validate response
    if (!response || response.trim().length === 0) {
      return {
        success: false,
        api: 'Gemini',
        testName: 'Basic Connection Test',
        error: 'Empty response received',
        timestamp: new Date(),
        duration
      };
    }
    
    console.log('✅ Gemini API Test Passed!', { response, duration });
    
    return {
      success: true,
      api: 'Gemini',
      testName: 'Basic Connection Test',
      response,
      timestamp: new Date(),
      duration
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('❌ Gemini API Test Failed:', errorMessage);
    
    return {
      success: false,
      api: 'Gemini',
      testName: 'Basic Connection Test',
      error: errorMessage,
      timestamp: new Date(),
      duration
    };
  }
}

/**
 * Test StepFun API connection with a simple query
 */
export async function testStepFunAPI(): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    console.log('🧪 Testing StepFun API...');
    
    const { response, structuredOutput } = await getStepFunResponse(
      'What is 2 + 2? Answer in one word.',
      'ideation',
      'text',
      true // concise mode for quick test
    );
    
    const duration = Date.now() - startTime;
    
    // Validate response
    if (!response || response.trim().length === 0) {
      return {
        success: false,
        api: 'StepFun',
        testName: 'Basic Connection Test',
        error: 'Empty response received',
        timestamp: new Date(),
        duration
      };
    }
    
    console.log('✅ StepFun API Test Passed!', { response, duration });
    
    return {
      success: true,
      api: 'StepFun',
      testName: 'Basic Connection Test',
      response,
      timestamp: new Date(),
      duration
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('❌ StepFun API Test Failed:', errorMessage);
    
    return {
      success: false,
      api: 'StepFun',
      testName: 'Basic Connection Test',
      error: errorMessage,
      timestamp: new Date(),
      duration
    };
  }
}

/**
 * Test domain-specific responses
 */
export async function testDomainResponses(domain: StartupDomain): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  try {
    console.log(`🧪 Testing ${domain} domain responses...`);
    
    // Test Gemini
    const geminiStart = Date.now();
    try {
      const { response } = await getGeminiResponse(
        `Give me one key tip for ${domain}`,
        domain,
        'text',
        true
      );
      
      results.push({
        success: !!response && response.length > 0,
        api: 'Gemini',
        testName: `${domain} Domain Test`,
        response,
        timestamp: new Date(),
        duration: Date.now() - geminiStart
      });
    } catch (error) {
      results.push({
        success: false,
        api: 'Gemini',
        testName: `${domain} Domain Test`,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        duration: Date.now() - geminiStart
      });
    }
    
    // Test StepFun
    const stepfunStart = Date.now();
    try {
      const { response } = await getStepFunResponse(
        `Give me one key tip for ${domain}`,
        domain,
        'text',
        true
      );
      
      results.push({
        success: !!response && response.length > 0,
        api: 'StepFun',
        testName: `${domain} Domain Test`,
        response,
        timestamp: new Date(),
        duration: Date.now() - stepfunStart
      });
    } catch (error) {
      results.push({
        success: false,
        api: 'StepFun',
        testName: `${domain} Domain Test`,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        duration: Date.now() - stepfunStart
      });
    }
    
  } catch (error) {
    console.error(`Error testing ${domain}:`, error);
  }
  
  return results;
}

/**
 * Run comprehensive API tests
 */
export async function runAllAPITests(): Promise<{
  summary: {
    total: number;
    passed: number;
    failed: number;
    successRate: number;
  };
  results: TestResult[];
}> {
  console.log('🚀 Starting Comprehensive API Tests...\n');
  
  const allResults: TestResult[] = [];
  
  // Test basic connectivity
  const geminiTest = await testGeminiAPI();
  const stepfunTest = await testStepFunAPI();
  
  allResults.push(geminiTest, stepfunTest);
  
  // Test all domains
  const domains: StartupDomain[] = ['ideation', 'marketing', 'fundraising', 'legal', 'operations', 'product'];
  
  for (const domain of domains) {
    const domainResults = await testDomainResponses(domain);
    allResults.push(...domainResults);
  }
  
  // Calculate summary
  const passed = allResults.filter(r => r.success).length;
  const failed = allResults.filter(r => !r.success).length;
  const successRate = (passed / allResults.length) * 100;
  
  const summary = {
    total: allResults.length,
    passed,
    failed,
    successRate
  };
  
  // Print results
  console.log('\n📊 Test Results Summary:');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${summary.total}`);
  console.log(`✅ Passed: ${summary.passed}`);
  console.log(`❌ Failed: ${summary.failed}`);
  console.log(`📈 Success Rate: ${successRate.toFixed(1)}%`);
  console.log('='.repeat(50));
  
  // Detailed results
  console.log('\n📋 Detailed Results:');
  allResults.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌';
    const status = result.success ? 'PASS' : 'FAIL';
    console.log(`${index + 1}. ${icon} [${result.api}] ${result.testName} - ${status}`);
    
    if (result.duration) {
      console.log(`   ⏱️ Duration: ${result.duration}ms`);
    }
    
    if (result.response) {
      console.log(`   💬 Response: ${result.response.substring(0, 100)}${result.response.length > 100 ? '...' : ''}`);
    }
    
    if (result.error) {
      console.log(`   ⚠️ Error: ${result.error}`);
    }
    
    console.log('');
  });
  
  return { summary, results: allResults };
}

/**
 * Validate environment variables
 */
export function validateEnvironmentVariables(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check Gemini API Key
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!geminiKey) {
    errors.push('VITE_GEMINI_API_KEY is not configured');
  } else if (!geminiKey.startsWith('AIza')) {
    warnings.push('Gemini API key format looks incorrect (should start with AIza)');
  }
  
  // Check StepFun API Key
  const stepfunKey = import.meta.env.VITE_STEPFUN_API_KEY;
  if (!stepfunKey) {
    errors.push('VITE_STEPFUN_API_KEY is not configured');
  } else if (!stepfunKey.startsWith('sk-or-v1-')) {
    warnings.push('StepFun API key format looks incorrect (should start with sk-or-v1-)');
  }
  
  // Check Google OAuth Client ID
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    warnings.push('VITE_GOOGLE_CLIENT_ID is not configured (Google Login will not work)');
  } else if (!googleClientId.includes('.apps.googleusercontent.com')) {
    warnings.push('Google Client ID format looks incorrect');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Quick health check for APIs
 */
export async function performHealthCheck(): Promise<{
  healthy: boolean;
  geminiHealthy: boolean;
  stepfunHealthy: boolean;
  details: TestResult[];
}> {
  const [geminiResult, stepfunResult] = await Promise.all([
    testGeminiAPI(),
    testStepFunAPI()
  ]);
  
  return {
    healthy: geminiResult.success && stepfunResult.success,
    geminiHealthy: geminiResult.success,
    stepfunHealthy: stepfunResult.success,
    details: [geminiResult, stepfunResult]
  };
}
