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

  useEffect(() => {
    // Auto-scroll to the bottom when new messages arrive
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      if (import.meta.env.DEV) {
        console.error("Error processing message:", error);
      }

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
    <Card className="w-full h-full flex flex-col rounded-2xl overflow-hidden border shadow-2xl card-hover">
      <div className="flex items-center justify-between bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-5 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">AI Co-Founder Chat</h2>
            <p className="text-xs text-muted-foreground">Powered by Gemini 1.5 Flash</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conciseMode && (
            <span className="bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-3 py-1.5 rounded-full text-xs font-medium hidden sm:inline-block animate-pulse-slow">
              ✨ Concise Mode
            </span>
          )}
          <Select value={selectedDomain} onValueChange={(v) => setSelectedDomain(v as StartupDomain)}>
            <SelectTrigger className="w-[200px] border-primary/20 hover:border-primary transition-colors">
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

      <div className="flex-grow p-6 overflow-y-auto message-container bg-gradient-to-b from-background to-muted/20">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex mb-6 animate-fade-in ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
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
        <div className={`flex items-center mb-3 p-4 rounded-xl border ${conciseMode ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30' : 'border-muted'}`}>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              onChange={(e) => setConciseMode(e.target.checked)}
              checked={conciseMode}
              className="h-5 w-5 rounded-lg border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <label className="text-sm font-semibold cursor-pointer select-none">
              Concise Mode {conciseMode && '(✨ Quick bullet points)'}
            </label>
          </div>
          <div className="text-xs ml-3 text-muted-foreground flex items-center gap-2">
            {conciseMode ? (
              <><span className="text-primary">●</span> Generating concise bullet points</>
            ) : (
              <><span className="text-secondary">●</span> Detailed comprehensive responses</>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            placeholder={conciseMode ? "Ask for quick bullet points..." : "Ask your AI co-founder anything..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-grow border-2 focus:border-primary transition-colors"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="btn-glow px-6"
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
