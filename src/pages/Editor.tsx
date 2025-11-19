import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";
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
  Link2,
  Eye,
  Edit3
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Editor = () => {
  const [title, setTitle] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose-editor max-w-none focus:outline-none min-h-[500px] px-12 py-8",
      },
    },
    onUpdate: ({ editor }) => {
      // Autosave trigger
      debouncedSave(editor.getHTML(), editor.getJSON());
    },
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedTitle = localStorage.getItem("draft-article-title");
    const savedContent = localStorage.getItem("draft-article");
    
    if (savedTitle) setTitle(savedTitle);
    if (savedContent && editor) {
      editor.commands.setContent(savedContent);
    }
  }, [editor]);

  // Autosave function
  const saveToLocalStorage = useCallback((html: string, json: any) => {
    localStorage.setItem("draft-article", html);
    localStorage.setItem("draft-article-json", JSON.stringify(json));
    localStorage.setItem("draft-article-title", title);
  }, [title]);

  // Debounced autosave (every 3 seconds)
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (html: string, json: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          saveToLocalStorage(html, json);
          toast({
            title: "Draft saved",
            description: "Your work has been saved automatically",
          });
        }, 3000);
      };
    })(),
    [saveToLocalStorage, toast]
  );

  // Save title changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("draft-article-title", title);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [title]);

  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title before publishing",
        variant: "destructive",
      });
      return;
    }

    if (!editor) return;

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content_html: editor.getHTML(),
          content_json: editor.getJSON(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Article published successfully!",
          description: "Your article is now live",
        });
        
        // Clear draft
        localStorage.removeItem("draft-article");
        localStorage.removeItem("draft-article-json");
        localStorage.removeItem("draft-article-title");
      } else {
        throw new Error("Failed to publish");
      }
    } catch (error) {
      toast({
        title: "Publishing failed",
        description: "Could not publish your article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAIGenerate = async (action: string) => {
    if (!editor) return;
    
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          content: editor.getHTML(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (action === "title") {
          setTitle(data.result);
        } else {
          editor.commands.insertContent(data.result);
        }
        
        toast({
          title: "AI generated",
          description: `Successfully generated ${action}`,
        });
      }
    } catch (error) {
      toast({
        title: "AI generation failed",
        description: "Could not generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          editor?.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setShowLinkDialog(true);
  };

  const saveLink = () => {
    if (linkUrl) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor?.chain().focus().unsetLink().run();
    }
    setShowLinkDialog(false);
    setLinkUrl("");
  };

  if (!editor) {
    return <div className="flex items-center justify-center min-h-screen">Loading editor...</div>;
  }

  const aiTools = [
    { label: "Generate Title", action: "title", icon: Sparkles },
    { label: "Generate Outline", action: "outline", icon: Sparkles },
    { label: "Summarize", action: "summarize", icon: Sparkles },
    { label: "Expand Content", action: "expand", icon: Sparkles },
    { label: "Improve Writing", action: "improve", icon: Sparkles },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="bg-background min-h-screen transition-colors">
        {/* Top Bar */}
        <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14">
              <div className="flex items-center gap-3">
                <RouterLink to="/dashboard">
                  <Button variant="ghost" size="sm" className="h-9">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </RouterLink>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9"
                  onClick={() => setIsPreview(!isPreview)}
                >
                  {isPreview ? (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="h-9" onClick={() => setIsDark(!isDark)}>
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9"
                  onClick={() => {
                    saveToLocalStorage(editor.getHTML(), editor.getJSON());
                    toast({
                      title: "Saved",
                      description: "Draft saved successfully",
                    });
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" className="h-9 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handlePublish}>
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
              {!isPreview && (
                <>
                  {/* Formatting Toolbar */}
                  <Card className="p-3 border-border/50">
                    <div className="flex flex-wrap gap-1">
                      <Button
                        variant={editor.isActive("bold") ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={editor.isActive("italic") ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button
                        variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        title="Heading 1"
                      >
                        <Heading1 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        title="Heading 2"
                      >
                        <Heading2 className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button
                        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        title="Bullet List"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        title="Numbered List"
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button
                        variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        title="Quote"
                      >
                        <Quote className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={editor.isActive("codeBlock") ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        title="Code Block"
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={addImage}
                        title="Image"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={editor.isActive("link") ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={setLink}
                        title="Link"
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>

                  {/* Title Input */}
                  <div className="space-y-2 px-12">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-5xl font-display font-bold border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/40 bg-transparent"
                      placeholder="Title"
                    />
                  </div>
                </>
              )}

              {/* Editor or Preview */}
              <Card className="min-h-[600px] border-border/50">
                {isPreview ? (
                  <div className="px-12 py-8">
                    <h1 className="font-display text-5xl font-bold mb-8">{title || "Untitled"}</h1>
                    <div
                      className="prose-editor max-w-none"
                      dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                    />
                  </div>
                ) : (
                  <EditorContent editor={editor} />
                )}
              </Card>
            </div>

            {/* AI Tools Sidebar */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
              <Card className="p-5 space-y-4 border-border/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <h3 className="font-semibold text-sm">AI Tools</h3>
                </div>
                <Separator />
                <div className="space-y-1.5">
                  {aiTools.map((tool, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-9 text-sm"
                      onClick={() => handleAIGenerate(tool.action)}
                      disabled={isGenerating}
                    >
                      <tool.icon className="h-3.5 w-3.5 mr-2" />
                      {tool.label}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Stats Card */}
              <Card className="p-5 space-y-4 border-border/50">
                <h3 className="font-semibold text-sm">Document Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Words</span>
                    <span className="font-medium">
                      {editor.state.doc.textContent.split(/\s+/).filter(Boolean).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Characters</span>
                    <span className="font-medium">
                      {editor.state.doc.textContent.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reading time</span>
                    <span className="font-medium">
                      {Math.ceil(
                        editor.state.doc.textContent.split(/\s+/).filter(Boolean).length / 200
                      )}{" "}
                      min
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>
              Enter the URL you want to link to
            </DialogDescription>
          </DialogHeader>
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveLink();
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveLink}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Editor;
