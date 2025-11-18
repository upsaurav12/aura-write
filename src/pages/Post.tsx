import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Zap, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

const Post = () => {
  const { id } = useParams();

  const article = {
    title: "Getting Started with AI Writing",
    subtitle: "Learn how to leverage AI to create amazing content faster than ever before",
    author: "John Doe",
    date: "January 15, 2024",
    readTime: "5 min read",
    content: `
# Introduction

Artificial Intelligence has revolutionized how we approach content creation. From automated writing assistants to intelligent editing tools, AI is making it easier than ever to produce high-quality content at scale.

## The Power of AI Writing

Modern AI systems can analyze tone, suggest improvements, and even generate entire drafts based on brief prompts. This doesn't replace human creativity—it enhances it.

### Key Benefits

1. **Speed**: Generate content 10x faster than traditional methods
2. **Quality**: Maintain high standards with AI-powered editing
3. **Consistency**: Keep your brand voice aligned across all content
4. **SEO**: Optimize for search engines automatically

## Getting Started

Here's how to begin your AI writing journey:

### Step 1: Choose Your Tools

Select an AI writing platform that fits your needs. Look for features like:
- Natural language generation
- Multiple content types support
- SEO optimization
- Collaboration features

### Step 2: Learn the Basics

Start with simple tasks:
- Generate blog outlines
- Expand bullet points into paragraphs
- Improve existing content
- Fix grammar and style issues

### Step 3: Master Advanced Features

Once comfortable, explore:
- Full article generation
- Tone adjustment
- SEO optimization
- Multi-language support

## Best Practices

### Do's
- Always review and edit AI-generated content
- Use AI as a creative partner, not a replacement
- Customize outputs to match your brand voice
- Iterate and refine based on results

### Don'ts
- Don't publish AI content without review
- Avoid over-relying on automation
- Don't ignore your unique perspective
- Never sacrifice quality for speed

## Real-World Applications

### Content Marketing
Create blog posts, social media content, and email campaigns faster.

### E-commerce
Generate product descriptions that convert.

### Corporate Communications
Draft reports, presentations, and internal documentation efficiently.

## The Future of AI Writing

As AI technology continues to evolve, we can expect:
- More sophisticated language models
- Better understanding of context and nuance
- Improved multi-modal capabilities
- Enhanced personalization

## Conclusion

AI writing tools are here to stay, and they're only getting better. By learning to work with these tools effectively, you can dramatically improve your content creation workflow while maintaining the human touch that makes your content unique.

The key is finding the right balance between automation and creativity. Use AI to handle the heavy lifting, but always add your personal insight and expertise to create truly exceptional content.

Ready to get started? Try using AI for your next blog post and see the difference it makes.
    `
  };

  const tableOfContents = [
    { id: "introduction", label: "Introduction" },
    { id: "power", label: "The Power of AI Writing" },
    { id: "getting-started", label: "Getting Started" },
    { id: "best-practices", label: "Best Practices" },
    { id: "applications", label: "Real-World Applications" },
    { id: "future", label: "The Future" },
    { id: "conclusion", label: "Conclusion" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BlogAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/editor">
                <Button className="btn-hero">Write</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Reading Progress Bar */}
      <div className="h-1 bg-primary/20 sticky top-16 z-40">
        <div className="h-full bg-primary w-1/3 transition-all duration-300" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">
          {/* Main Content */}
          <article className="max-w-3xl">
            {/* Back Button */}
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            {/* Article Header */}
            <div className="space-y-6 mb-12 animate-fade-in">
              <h1 className="text-5xl font-bold leading-tight">{article.title}</h1>
              <p className="text-2xl text-muted-foreground">{article.subtitle}</p>
              
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">JD</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{article.author}</p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </div>
                <span>{article.date}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <Separator />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none animate-slide-up">
              <div className="space-y-6 leading-relaxed">
                {article.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-4xl font-bold mt-12 mb-6">{paragraph.slice(2)}</h1>;
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-3xl font-semibold mt-10 mb-4">{paragraph.slice(3)}</h2>;
                  } else if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-2xl font-semibold mt-8 mb-3">{paragraph.slice(4)}</h3>;
                  } else if (paragraph.match(/^\d+\./)) {
                    return (
                      <div key={index} className="pl-6">
                        <p className="mb-2">{paragraph}</p>
                      </div>
                    );
                  } else {
                    return paragraph.trim() && <p key={index} className="text-lg leading-relaxed mb-6">{paragraph}</p>;
                  }
                })}
              </div>
            </div>

            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">{article.author}</p>
                    <p className="text-sm text-muted-foreground">Content Creator</p>
                  </div>
                </div>
                <Button className="btn-hero">Follow</Button>
              </div>
            </div>
          </article>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Post;
