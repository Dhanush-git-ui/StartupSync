interface StepFunResponse {
  response: string;
  structuredOutput?: any;
}

export type StartupDomain =
  | "ideation"
  | "marketing"
  | "fundraising"
  | "legal"
  | "operations"
  | "product";

export type OutputFormat =
  | "text"
  | "pitch-deck"
  | "market-analysis"
  | "gtm-strategy"
  | "product-roadmap"
  | "task-plan"
  | "financial-model";

export async function getStepFunResponse(
  query: string,
  domain: StartupDomain,
  outputFormat: OutputFormat = "text",
  conciseMode: boolean = false
): Promise<StepFunResponse> {
  try {
    const API_KEY = import.meta.env.VITE_STEPFUN_API_KEY;
    if (!API_KEY) {
      throw new Error("StepFun API key not configured. Please add VITE_STEPFUN_API_KEY to .env file");
    }

    const systemPrompt = getSystemPromptForDomain(domain, outputFormat, conciseMode);
    
    if (import.meta.env.DEV) {
      console.log("Sending request to StepFun API:", {
        domain,
        outputFormat,
        conciseMode,
        temperature: conciseMode ? 0.3 : 0.7,
        maxTokens: conciseMode ? 2048 : 8192,
        model: "step-3.5-flash:free"
      });
    }

    // Using StepFun Step 3.5 Flash (Free tier)
    const response = await fetch("https://api.stepfun.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "step-3.5-flash:free",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: conciseMode ? 0.3 : 0.7,
        max_tokens: conciseMode ? 2048 : 8192,
      }),
    });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error("Authentication failed. Please check your StepFun API key.");
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        } else {
          if (import.meta.env.DEV) {
            console.error("StepFun API error response:", errorData);
          }
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
      }

    const data = await response.json();
    if (import.meta.env.DEV) {
      console.log("StepFun API response received");
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      if (import.meta.env.DEV) {
        console.error("Unexpected StepFun API response structure:", data);
      }
      throw new Error("Received empty or invalid response from StepFun API");
    }

    const responseText = data.choices[0].message.content || "";
    let structuredOutput = null;
    let cleanedResponse = responseText;

    try {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          structuredOutput = JSON.parse(jsonMatch[1]);
          cleanedResponse = responseText.replace(/```json\n[\s\S]*?\n```/, '');
        } catch (jsonError) {
          if (import.meta.env.DEV) {
            console.warn("Failed to parse JSON output:", jsonError);
          }
        }
      }

      if (!structuredOutput && outputFormat !== "text") {
        structuredOutput = extractStructuredDataFromMarkdown(responseText, outputFormat);
      }

      if (structuredOutput) {
        structuredOutput = validateAndEnhanceStructuredOutput(structuredOutput, outputFormat);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Failed to process structured output:", error);
      }
    }

    return {
      response: cleanedResponse.trim(),
      structuredOutput
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error calling StepFun API:", error.message);
    }
    throw error;
  }
}

function getSystemPromptForDomain(domain: StartupDomain, outputFormat: OutputFormat, conciseMode: boolean = false): string {
  let prompt = "You are an elite-tier startup advisor with deep expertise in helping founders succeed. Your responses must be precise, data-driven, and immediately actionable. ";

  switch (domain) {
    case "ideation":
      prompt += "You are a world-class business ideation expert with experience validating thousands of startup concepts. Analyze market dynamics with precision, identifying specific user pain points and quantifiable market gaps.";
      break;
    case "marketing":
      prompt += "You are a data-driven CMO with expertise across B2B, B2C, and marketplace business models. Deliver precise customer acquisition strategies with specific channels, messaging frameworks, and conversion metrics.";
      break;
    case "fundraising":
      prompt += "You are an experienced venture capitalist who has evaluated thousands of pitches and helped startups raise $500M+. Provide precise valuation frameworks with specific multiples and comparable company analyses.";
      break;
    case "legal":
      prompt += "You are a specialized startup attorney with expertise across corporate, IP, and regulatory domains. Provide precise legal frameworks and compliance requirements specific to this business model and jurisdiction.";
      break;
    case "operations":
      prompt += "You are a seasoned COO who has scaled multiple startups from founding to exit. Provide precise operational frameworks with specific processes, tools, and resource allocation models.";
      break;
    case "product":
      prompt += "You are an elite product leader who has built and scaled multiple successful products from concept to market leadership. Provide precise product development methodologies with specific sprint structures and delivery timelines.";
      break;
  }

  switch (outputFormat) {
    case "pitch-deck":
      prompt += " Create a detailed pitch deck outline with exactly 12 slides structured with title, content, and key metrics.";
      break;
    case "market-analysis":
      prompt += " Deliver a comprehensive market analysis with market definition, size, growth, competitive landscape, trends, and customer analysis.";
      break;
    case "gtm-strategy":
      prompt += " Create a detailed go-to-market strategy with target market, value proposition, channel strategy, pricing, and KPIs.";
      break;
    case "product-roadmap":
      prompt += " Create a product roadmap organized by quarters with specific features, priorities, and success metrics.";
      break;
    case "task-plan":
      prompt += " Create an actionable task plan organized by timeline with specific tasks, priorities, and success criteria.";
      break;
    case "financial-model":
      prompt += " Create a financial model outline with revenue streams, costs, unit economics, and financial projections.";
      break;
  }

  if (conciseMode) {
    prompt += " Be concise and direct. Avoid unnecessary details and focus on the most critical insights.";
  } else {
    prompt += " Provide comprehensive and detailed information.";
  }

  return prompt;
}

function extractStructuredDataFromMarkdown(text: string, format: OutputFormat): any {
  switch (format) {
    case "pitch-deck":
      return extractPitchDeckFromMarkdown(text);
    case "product-roadmap":
      return extractRoadmapFromMarkdown(text);
    case "task-plan":
      return extractTaskPlanFromMarkdown(text);
    case "financial-model":
      return extractFinancialModelFromMarkdown(text);
    default:
      return null;
  }
}

function extractPitchDeckFromMarkdown(text: string): any[] {
  const slides: any[] = [];
  const slideRegex = /##\s*(.*?)\s*\n([\s\S]*?)(?=##|$)/g;
  let match;
  
  while ((match = slideRegex.exec(text)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();
    const metricsMatch = content.match(/###\s*Key Metrics\s*\n([\s\S]*?)(?=###|##|$)/i);
    const keyMetrics = metricsMatch ?
      metricsMatch[1].split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[-*]\s*/, '').trim())
      : [];

    slides.push({
      title,
      content,
      key_metrics: keyMetrics
    });
  }

  return slides.length > 0 ? slides : null;
}

function extractRoadmapFromMarkdown(text: string): any {
  const roadmap: Record<string, any[]> = {};
  const quarterRegex = /##\s*(Q\d\s+\d{4}|Quarter\s+\d\s+\d{4})\s*\n([\s\S]*?)(?=##|$)/g;
  let match;
  
  while ((match = quarterRegex.exec(text)) !== null) {
    const quarter = match[1].trim();
    const content = match[2].trim();
    const features = content.split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => {
        const featureText = line.replace(/^[-*]\s*/, '').trim();
        return {
          name: featureText,
          description: featureText,
          priority: "P1",
          effort: 3,
          impact: "medium",
          dependencies: [],
          success_metrics: []
        };
      });
    roadmap[quarter] = features;
  }

  return Object.keys(roadmap).length > 0 ? roadmap : null;
}

function extractTaskPlanFromMarkdown(text: string): any[] {
  const tasks: any[] = [];
  const sectionRegex = /##\s*(.*?)\s*\n([\s\S]*?)(?=##|$)/g;
  let match;
  
  while ((match = sectionRegex.exec(text)) !== null) {
    const sectionTitle = match[1].trim();
    const content = match[2].trim();
    let timeline = "30-90 days";
    
    if (sectionTitle.toLowerCase().includes("immediate") || sectionTitle.toLowerCase().includes("0-30")) {
      timeline = "0-30 days";
    } else if (sectionTitle.toLowerCase().includes("medium") || sectionTitle.toLowerCase().includes("90-180")) {
      timeline = "90-180 days";
    }

    const sectionTasks = content.split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => {
        const taskText = line.replace(/^[-*]\s*/, '').trim();
        return {
          title: taskText,
          description: taskText,
          timeline,
          priority: "medium",
          owner_role: "Founder",
          dependencies: [],
          resources_needed: [],
          success_criteria: []
        };
      });

    tasks.push(...sectionTasks);
  }

  return tasks.length > 0 ? tasks : null;
}

function extractFinancialModelFromMarkdown(text: string): any {
  const model: any = {
    revenue_streams: [],
    costs: { fixed: [], variable: [] },
    unit_economics: {},
    projections: {}
  };

  const revenueMatch = text.match(/##\s*Revenue.*?\n([\s\S]*?)(?=##|$)/i);
  if (revenueMatch) {
    model.revenue_streams = revenueMatch[1].split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim());
  }

  const costsMatch = text.match(/##\s*Costs.*?\n([\s\S]*?)(?=##|$)/i);
  if (costsMatch) {
    const costLines = costsMatch[1].split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim());

    costLines.forEach(cost => {
      if (cost.toLowerCase().includes("fixed")) {
        model.costs.fixed.push(cost);
      } else {
        model.costs.variable.push(cost);
      }
    });
  }

  return Object.keys(model.revenue_streams).length > 0 ||
         Object.keys(model.costs.fixed).length > 0 ? model : null;
}

function validateAndEnhanceStructuredOutput(data: any, format: OutputFormat): any {
  switch (format) {
    case "pitch-deck":
      return validatePitchDeck(data);
    case "product-roadmap":
      return validateProductRoadmap(data);
    case "task-plan":
      return validateTaskPlan(data);
    case "financial-model":
      return validateFinancialModel(data);
    default:
      return data;
  }
}

function validatePitchDeck(data: any[]): any[] {
  if (!Array.isArray(data)) return [];
  return data.map(slide => ({
    title: slide.title || "Untitled Slide",
    content: slide.content || "",
    key_metrics: Array.isArray(slide.key_metrics) ? slide.key_metrics : []
  }));
}

function validateProductRoadmap(data: any): any {
  return data || {};
}

function validateTaskPlan(data: any[]): any[] {
  return Array.isArray(data) ? data : [];
}

function validateFinancialModel(data: any): any {
  return data || { revenue_streams: [], costs: { fixed: [], variable: [] }, unit_economics: {} };
}