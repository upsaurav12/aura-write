import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Zap, 
  Save, 
  Sparkles, 
  Moon, 
  Sun,
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Quote,
  Image as ImageIcon,
  Link2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const Editor = () => {
  const [title, setTitle] = useState("Untitled Article");
  const [content, setContent] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Article saved",
      description: "Your changes have been saved successfully",
    });
  };

  const handleAIGenerate = async (action: string) => {
    setIsGenerating(true);
    // Mock AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults: Record<string, string> = {
      title: "10 Revolutionary Ways AI is Transforming Content Creation in 2024",
      expand: "\n\nArtificial Intelligence has revolutionized how we approach content creation. From automated writing assistants to intelligent editing tools, AI is making it easier than ever to produce high-quality content. Modern AI systems can analyze tone, suggest improvements, and even generate entire drafts based on brief prompts.",
      summarize: "\n\nKey Takeaway: This section highlights the transformative impact of AI on modern workflows and productivity.",
      grammar: content.replace(/\s+/g, " ").trim(),
      tone: "\n\nThis content demonstrates a professional yet engaging tone that resonates with modern readers while maintaining clarity and authority.",
      seo: "\n\nOptimized for search engines with strategic keyword placement and natural language flow.",
      outline: "## Article Outline\n\n1. Introduction\n   - Hook the reader\n   - Present the main topic\n\n2. Main Points\n   - Key concept 1\n   - Key concept 2\n   - Key concept 3\n\n3. Supporting Details\n   - Evidence and examples\n   - Data and statistics\n\n4. Conclusion\n   - Summary of key points\n   - Call to action",
      full: "# The Future of AI-Powered Content Creation\n\nIn today's digital landscape, content creators face unprecedented challenges. The demand for high-quality, engaging content has never been higher, yet the time and resources available remain limited.\n\n## The Revolution Begins\n\nArtificial Intelligence is changing everything. Modern AI writing assistants can help brainstorm ideas, generate drafts, and refine content with remarkable precision. These tools don't replace human creativity—they enhance it.\n\n## Key Benefits\n\n1. **Speed**: Generate content 10x faster\n2. **Quality**: Maintain high standards consistently\n3. **SEO**: Optimize for search engines automatically\n4. **Consistency**: Keep your brand voice aligned\n\n## Real-World Applications\n\nCompanies across industries are leveraging AI to:\n- Create blog posts and articles\n- Generate social media content\n- Draft email campaigns\n- Produce product descriptions\n\n## The Human Touch\n\nWhile AI is powerful, the human element remains crucial. The best content combines AI efficiency with human creativity, insight, and emotional intelligence.\n\n## Conclusion\n\nThe future of content creation is collaborative—humans and AI working together to produce exceptional results. Embrace these tools, and you'll find yourself creating better content faster than ever before."
    };

    if (action === "full") {
      setContent(mockResults[action]);
    } else if (action === "title") {
      setTitle(mockResults[action]);
    } else {
      setContent(content + mockResults[action]);
    }
    
    setIsGenerating(false);
    toast({
      title: "AI generated",
      description: `Successfully generated ${action}`,
    });
  };

  const aiTools = [
    { label: "Generate Title", action: "title", icon: Sparkles },
    { label: "Expand Paragraph", action: "expand", icon: Sparkles },
    { label: "Summarize", action: "summarize", icon: Sparkles },
    { label: "Fix Grammar", action: "grammar", icon: Sparkles },
    { label: "Improve Tone", action: "tone", icon: Sparkles },
    { label: "SEO Optimize", action: "seo", icon: Sparkles },
    { label: "Generate Outline", action: "outline", icon: Sparkles },
  ];

  const formatButtons = [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Heading1, label: "H1" },
    { icon: Heading2, label: "H2" },
    { icon: List, label: "Bullets" },
    { icon: ListOrdered, label: "Numbers" },
    { icon: Quote, label: "Quote" },
    { icon: Code, label: "Code" },
    { icon: ImageIcon, label: "Image" },
    { icon: Link2, label: "Link" },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* Top Bar */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-bold hidden sm:inline">BlogAI</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button className="btn-hero" size="sm">
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Editor Area */}
          <div className="space-y-6">
            {/* Formatting Toolbar */}
            <Card className="p-4">
              <div className="flex flex-wrap gap-2">
                {formatButtons.map((btn, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    title={btn.label}
                  >
                    <btn.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </Card>

            {/* Title Input */}
            <div className="space-y-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-4xl font-bold border-none shadow-none px-0 focus-visible:ring-0"
                placeholder="Article title..."
              />
            </div>

            {/* Content Editor */}
            <Card className="min-h-[600px] p-8">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[550px] border-none shadow-none text-lg leading-relaxed resize-none focus-visible:ring-0"
                placeholder="Start writing... Type / for commands"
              />
            </Card>
          </div>

          {/* AI Tools Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">AI Tools</h3>
              </div>
              <Separator />
              <div className="space-y-2">
                {aiTools.map((tool, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleAIGenerate(tool.action)}
                    disabled={isGenerating}
                  >
                    <tool.icon className="h-4 w-4 mr-2" />
                    {tool.label}
                  </Button>
                ))}
              </div>
              <Separator />
              <Button
                className="w-full btn-hero"
                onClick={() => handleAIGenerate("full")}
                disabled={isGenerating}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Write For Me"}
              </Button>
            </Card>

            {/* Stats Card */}
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Document Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Words</span>
                  <span className="font-medium">{content.split(/\s+/).filter(Boolean).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Characters</span>
                  <span className="font-medium">{content.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reading time</span>
                  <span className="font-medium">
                    {Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
