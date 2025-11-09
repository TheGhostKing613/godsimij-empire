import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Database, Key, BookOpen } from "lucide-react";

export default function ApiDocs() {
  const projectId = "dmtltkkfyujsvxiwpngv";
  const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtdGx0a2tmeXVqc3Z4aXdwbmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2OTk5NjYsImV4cCI6MjA3ODI3NTk2Nn0.Fq1FSpUAetgVKzLJeDz-Uf7Y6o_JUNxmWOms3A50EnA";
  const baseUrl = `https://${projectId}.supabase.co/rest/v1`;

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Code className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">API Documentation</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access our content programmatically through our REST API. All endpoints are public and don't require authentication.
          </p>
        </div>

        <Tabs defaultValue="getting-started" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="scrolls">Scrolls</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Key className="w-6 h-6 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Authentication</h3>
                  <p className="text-muted-foreground mb-4">
                    All read endpoints are public and require the anonymous API key in the headers.
                  </p>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <div className="text-primary">apikey: <span className="text-foreground">{anonKey}</span></div>
                    <div className="text-primary mt-2">Authorization: <span className="text-foreground">Bearer {anonKey}</span></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Database className="w-6 h-6 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Base URL</h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {baseUrl}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <BookOpen className="w-6 h-6 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Example Request</h3>
                  <p className="text-muted-foreground mb-4">Using JavaScript fetch:</p>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`fetch('${baseUrl}/scrolls?select=*&status=eq.Published', {
  headers: {
    'apikey': '${anonKey}',
    'Authorization': 'Bearer ${anonKey}'
  }
})
  .then(res => res.json())
  .then(data => console.log(data));`}</pre>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="scrolls" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Get All Published Scrolls</h3>
                <Badge variant="outline" className="text-green-600">GET</Badge>
              </div>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                GET {baseUrl}/scrolls?select=*&status=eq.Published
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Response Schema:</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <pre>{`[
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "content": "string",
    "pages": "string | null",
    "status": "Published",
    "file_url": "string | null",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Query Parameters:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li><code className="bg-muted px-2 py-0.5 rounded">select=*</code> - Select all columns</li>
                    <li><code className="bg-muted px-2 py-0.5 rounded">status=eq.Published</code> - Filter by published status</li>
                    <li><code className="bg-muted px-2 py-0.5 rounded">order=created_at.desc</code> - Order by creation date</li>
                    <li><code className="bg-muted px-2 py-0.5 rounded">limit=10</code> - Limit results</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Get All Projects</h3>
                <Badge variant="outline" className="text-green-600">GET</Badge>
              </div>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                GET {baseUrl}/projects?select=*
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Response Schema:</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <pre>{`[
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "status": "string",
    "category": "string | null",
    "link": "string | null",
    "image_url": "string | null",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Query Parameters:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li><code className="bg-muted px-2 py-0.5 rounded">select=*</code> - Select all columns</li>
                    <li><code className="bg-muted px-2 py-0.5 rounded">status=eq.Active</code> - Filter by status</li>
                    <li><code className="bg-muted px-2 py-0.5 rounded">category=eq.AI</code> - Filter by category</li>
                    <li><code className="bg-muted px-2 py-0.5 rounded">order=created_at.desc</code> - Order by date</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Get All Media</h3>
                <Badge variant="outline" className="text-green-600">GET</Badge>
              </div>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                GET {baseUrl}/media?select=*
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Response Schema:</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <pre>{`[
  {
    "id": "uuid",
    "type": "string",
    "title": "string",
    "content": "string",
    "author": "string | null",
    "date": "date | null",
    "file_url": "string | null",
    "embed_url": "string | null",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Media Types:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge>blog</Badge>
                    <Badge>podcast</Badge>
                    <Badge>video</Badge>
                    <Badge>meme</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Query Parameters:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li><code className="bg-muted px-2 py-0.5 rounded">select=*</code> - Select all columns</li>
                    <li><code className="bg-muted px-2 py-0.5 rounded">type=eq.blog</code> - Filter by media type</li>
                    <li><code className="bg-muted px-2 py-0.5 rounded">order=date.desc</code> - Order by date</li>
                    <li><code className="bg-muted px-2 py-0.5 rounded">limit=10</code> - Limit results</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-6 mt-8 border-primary/20">
          <h3 className="text-xl font-semibold mb-4">Additional Resources</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Full PostgREST documentation: <a href="https://postgrest.org" className="text-primary hover:underline">postgrest.org</a></li>
            <li>• Query filtering: <a href="https://postgrest.org/en/stable/references/api/tables_views.html" className="text-primary hover:underline">PostgREST Filters</a></li>
            <li>• Rate limits: Public API has standard rate limiting applied</li>
            <li>• Support: Contact us for integration assistance</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
