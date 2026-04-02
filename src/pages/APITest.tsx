import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  runAllAPITests, 
  validateEnvironmentVariables, 
  performHealthCheck,
  TestResult 
} from '@/utils/apiTests';
import { Brain, Zap, CheckCircle2, XCircle, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';

const APITestPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
    successRate: number;
  } | null>(null);
  const [envValidation, setEnvValidation] = useState<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const { summary: testSummary, results: testResults } = await runAllAPITests();
      setSummary(testSummary);
      setResults(testResults);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleValidateEnv = () => {
    const validation = validateEnvironmentVariables();
    setEnvValidation(validation);
  };

  const handleQuickHealthCheck = async () => {
    setIsRunning(true);
    try {
      const health = await performHealthCheck();
      setResults(health.details);
      setSummary({
        total: 2,
        passed: health.details.filter(r => r.success).length,
        failed: health.details.filter(r => !r.success).length,
        successRate: health.healthy ? 100 : 0
      });
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">API Testing Dashboard</h1>
          <p className="text-muted-foreground">
            Test Gemini and StepFun API integrations with comprehensive diagnostics
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Run All Tests
              </CardTitle>
              <CardDescription>
                Comprehensive API testing suite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleRunTests} 
                disabled={isRunning}
                className="w-full btn-glow"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Start Tests
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-secondary" />
                Health Check
              </CardTitle>
              <CardDescription>
                Quick connectivity verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleQuickHealthCheck} 
                disabled={isRunning}
                variant="outline"
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Quick Check
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Validate Env
              </CardTitle>
              <CardDescription>
                Check environment variables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleValidateEnv} 
                variant="secondary"
                className="w-full"
              >
                Validate
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Environment Validation Results */}
        {envValidation && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {envValidation.valid ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                Environment Variables Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {envValidation.errors.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-destructive mb-2">Errors:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                    {envValidation.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {envValidation.warnings.length > 0 && (
                <div>
                  <h4 className="font-semibold text-warning mb-2">Warnings:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-warning">
                    {envValidation.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {summary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">{summary.total}</div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-3xl font-bold text-success mb-1">{summary.passed}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <div className="text-3xl font-bold text-destructive mb-1">{summary.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">{summary.successRate.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Test Results</CardTitle>
              <CardDescription>
                Individual test outcomes and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.success 
                        ? 'bg-success/5 border-success/20' 
                        : 'bg-destructive/5 border-destructive/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <div>
                          <div className="font-semibold">
                            [{result.api}] {result.testName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={result.success ? 'default' : 'destructive'}>
                        {result.success ? 'PASS' : 'FAIL'}
                      </Badge>
                    </div>
                    
                    {result.duration && (
                      <div className="text-sm text-muted-foreground mb-2">
                        ⏱️ Duration: {result.duration}ms
                      </div>
                    )}
                    
                    {result.response && (
                      <div className="mt-2 p-3 bg-background rounded-md">
                        <div className="text-xs font-medium mb-1">Response:</div>
                        <div className="text-sm">{result.response}</div>
                      </div>
                    )}
                    
                    {result.error && (
                      <div className="mt-2 p-3 bg-destructive/10 rounded-md">
                        <div className="text-xs font-medium text-destructive mb-1">Error:</div>
                        <div className="text-sm text-destructive">{result.error}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Testing Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What gets tested:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Gemini API connectivity with gemini-2.5-flash model</li>
                <li>StepFun API connectivity with step-3.5-flash:free model</li>
                <li>All 6 domain responses (Ideation, Marketing, Fundraising, Legal, Operations, Product)</li>
                <li>Environment variable configuration</li>
                <li>API key validity and format</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Expected Results:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>All tests should pass with ✅ status</li>
                <li>Response time should be under 3 seconds</li>
                <li>No authentication errors</li>
                <li>Valid JSON responses for structured outputs</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Troubleshooting:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Check .env file has correct API keys</li>
                <li>Verify API keys haven't expired</li>
                <li>Ensure internet connection is active</li>
                <li>Check browser console for detailed error logs</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APITestPage;
