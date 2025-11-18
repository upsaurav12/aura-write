import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Zap, 
  Plus, 
  FileText, 
  Clock, 
  MoreVertical,
  Edit,
  Eye,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const articles = [
    {
      id: 1,
      title: "Getting Started with AI Writing",
      excerpt: "Learn how to leverage AI to create amazing content faster than ever before...",
      status: "published",
      lastEdited: "2 hours ago",
      words: 1250
    },
    {
      id: 2,
      title: "10 Tips for Better Blog Posts",
      excerpt: "Discover the secrets to writing engaging blog posts that your audience will love...",
      status: "draft",
      lastEdited: "1 day ago",
      words: 890
    },
    {
      id: 3,
      title: "SEO Best Practices 2024",
      excerpt: "Master the latest SEO techniques to boost your content visibility...",
      status: "published",
      lastEdited: "3 days ago",
      words: 2100
    },
    {
      id: 4,
      title: "Content Marketing Strategy",
      excerpt: "Build a comprehensive content marketing strategy that drives results...",
      status: "draft",
      lastEdited: "1 week ago",
      words: 1560
    }
  ];

  const stats = [
    { label: "Total Articles", value: "24", icon: FileText },
    { label: "Published", value: "18", icon: Eye },
    { label: "Drafts", value: "6", icon: Edit },
    { label: "This Month", value: "12", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BlogAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost">Settings</Button>
              </Link>
              <Link to="/editor">
                <Button className="btn-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  New Article
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your articles and track your progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="p-6 animate-slide-up card-elevated"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Articles Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Articles</h2>
            <div className="flex gap-2">
              <Button variant="outline">All</Button>
              <Button variant="outline">Published</Button>
              <Button variant="outline">Drafts</Button>
            </div>
          </div>

          <div className="grid gap-6">
            {articles.map((article, index) => (
              <Card 
                key={article.id}
                className="p-6 hover:shadow-medium transition-all duration-300 animate-fade-in card-elevated"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{article.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.status === 'published' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {article.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-3">{article.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {article.lastEdited}
                          </div>
                          <div>
                            {article.words} words
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/editor" className="flex items-center cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/post/${article.id}`} className="flex items-center cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
