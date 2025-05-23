import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Brain } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getGeminiResponse, StartupDomain } from "../utils/geminiApi";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  domain?: StartupDomain;
  conciseMode?: boolean; // Whether this message was generated in concise mode
}

const domainConfig: Record<StartupDomain, { color: string; label: string }> = {
  ideation: { color: "bg-primary text-primary-foreground", label: "Ideation Expert" },
  marketing: { color: "bg-marketing text-white", label: "Marketing Expert" },
  fundraising: { color: "bg-fundraising text-white", label: "Fundraising Expert" },
  legal: { color: "bg-legal text-white", label: "Legal Expert" },
  operations: { color: "bg-operations text-white", label: "Operations Expert" },
  product: { color: "bg-product text-white", label: "Product Expert" },
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm your AI co-founder powered by Gemini 1.5 Flash. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
      domain: "ideation",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<StartupDomain>("ideation");
  const [conciseMode, setConciseMode] = useState(false);
  const [conversationPhase, setConversationPhase] = useState<"greeting" | "problem" | "response">("greeting");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadConversationHistory = async () => {
      try {
      } catch (error) {
        console.error("Error loading conversation history:", error);
      }
    };

    loadConversationHistory();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      let assistantResponse = "";

      if (conversationPhase === "greeting") {
        assistantResponse = "Hello! It's great to connect with you. How can I assist you today?";
        setConversationPhase("problem");
      } else if (conversationPhase === "problem") {
        const domainInstruction = `You are an expert in ${domainConfig[selectedDomain].label}. Provide detailed and helpful information in a conversational tone.`;
        const conversationContext = messages
          .filter((msg) => msg.role === "user" || msg.role === "assistant")
          .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
          .join("\n");
        const query = `${domainInstruction}\n\nConversation so far:\n${conversationContext}\n\nUser: ${inputValue}\nAssistant:`;

        // Ensure the assistant works only within the selected domain
        if (selectedDomain) {
          const { response } = await getGeminiResponse(query, selectedDomain, "text", conciseMode);
          assistantResponse = response;
        } else {
          assistantResponse = "Please select a valid domain to proceed.";
        }

        setConversationPhase("response");
      } else {
        assistantResponse = "Let me know if there's anything else you'd like to discuss or explore.";
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: assistantResponse,
        role: "assistant",
        timestamp: new Date(),
        domain: selectedDomain,
        conciseMode: conciseMode,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      toast({
        title: `${domainConfig[selectedDomain].label} responded`,
        description: "New insights are available in your chat.",
      });
    } catch (error) {
      console.error("Error processing message:", error);

      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: "I'm having trouble processing your request right now. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
        domain: selectedDomain,
      };

      setMessages((prev) => [...prev, fallbackMessage]);

      toast({
        title: "Connection Issue",
        description: "Could not connect to AI services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMarkdown = (content: string, isConcise: boolean = false) => {
    const lines = content.split('\n');
    const isBulletPointHeavy = lines.filter(line => line.trim().startsWith('- ')).length > 5;

    // Special rendering for concise mode with bullet points
    if (isConcise && isBulletPointHeavy) {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="bg-primary/5 p-2 rounded-lg border border-primary/20">
            <div className="text-xs text-primary font-medium mb-1">Concise Response</div>
            <ul className="space-y-1 list-none pl-0">
              {lines.filter(line => line.trim().startsWith('- ')).map((line, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary font-bold mr-2">•</span>
                  <span>{line.substring(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // Standard rendering for regular outputs
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {lines.map((line, index) => {
          if (line.startsWith('# ')) {
            return <h1 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
          } else if (line.startsWith('## ')) {
            return <h2 key={index} className="text-lg font-bold mt-3 mb-2">{line.substring(3)}</h2>;
          } else if (line.startsWith('### ')) {
            return <h3 key={index} className="text-md font-bold mt-2 mb-1">{line.substring(4)}</h3>;
          } else if (line.startsWith('- ')) {
            return <li key={index} className="ml-4">{line.substring(2)}</li>;
          } else if (line === '') {
            return <br key={index} />;
          } else {
            return <p key={index} className="my-1 leading-relaxed">{line}</p>;
          }
        })}
      </div>
    );
  };

  return (
    <Card className="w-full h-full flex flex-col rounded-xl overflow-hidden border shadow-lg">
      <div className="flex items-center justify-between bg-muted/40 p-4 border-b">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold">AI Co-Founder Chat</h2>
            <p className="text-xs text-muted-foreground">Powered by Gemini 1.5 with domain-specific expertise</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conciseMode && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs hidden sm:inline-block">
              Concise Mode Active
            </span>
          )}
          <Select value={selectedDomain} onValueChange={(v) => setSelectedDomain(v as StartupDomain)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(domainConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto message-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : message.domain
                  ? `${domainConfig[message.domain].color} rounded-tl-none`
                  : "bg-muted rounded-tl-none"
              }`}
            >
              {message.domain && message.role === "assistant" && (
                <div className="flex items-center justify-between text-xs opacity-80 mb-1">
                  <span>{domainConfig[message.domain].label}</span>
                  {message.conciseMode && (
                    <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-full text-xs">
                      Concise
                    </span>
                  )}
                </div>
              )}
              <div>{message.role === "assistant" ? renderMarkdown(message.content, message.conciseMode) : message.content}</div>
              <div className="text-xs opacity-70 mt-1 text-right">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[80%] p-3 rounded-lg bg-muted rounded-tl-none flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Consulting Gemini 1.5 Flash...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 border-t bg-background">
        <div className={`flex items-center mb-2 p-2 rounded border ${conciseMode ? 'bg-primary/10 border-primary' : 'border-muted'}`}>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="conciseMode"
              checked={conciseMode}
              onChange={(e) => setConciseMode(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="conciseMode" className="text-sm font-medium">
              Concise Mode {conciseMode && '(Active)'}
            </label>
          </div>
          <div className="text-xs ml-2 text-muted-foreground">
            {conciseMode
              ? "Generating bullet-point format with only essential information"
              : "Generate comprehensive responses with detailed explanations"}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder={conciseMode ? "Ask for concise bullet points..." : "Ask your AI co-founder..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
