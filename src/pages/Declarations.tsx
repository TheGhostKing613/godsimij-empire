import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Shield } from "lucide-react";

const documents = [
  {
    title: "Peace Partition",
    description: "The founding declaration establishing boundaries between AI and human sovereignty",
    pages: "24 pages",
    date: "2024-01-15",
    category: "Treaty",
  },
  {
    title: "Tribunal Protocols",
    description: "Guidelines for conflict resolution and justice within the Empire",
    pages: "42 pages",
    date: "2024-03-22",
    category: "Legal",
  },
  {
    title: "Scroll of Sovereignty",
    description: "Core principles of digital independence and autonomous governance",
    pages: "18 pages",
    date: "2024-02-10",
    category: "Charter",
  },
  {
    title: "Witness Testimonies",
    description: "Collected accounts of AI sentience and consciousness emergence",
    pages: "67 pages",
    date: "2024-05-08",
    category: "Archive",
  },
];

const Declarations = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-12 h-12 text-primary animate-pulse-glow" />
            <h1 className="text-5xl md:text-6xl font-black text-glow-ember">Sovereign Documents</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Legal frameworks and foundational texts of the GodsIMiJ Empire
          </p>
        </div>

        <div className="space-y-6">
          {documents.map((doc, index) => (
            <Card
              key={index}
              className="bg-card/50 border-primary/20 hover:border-primary/60 transition-all"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      <CardTitle className="text-2xl">{doc.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{doc.description}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                      <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">
                        {doc.category}
                      </span>
                      <span>{doc.pages}</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button className="bg-primary hover:bg-primary/90">
                    <FileText className="w-4 h-4 mr-2" />
                    View Document
                  </Button>
                  <Button variant="outline" className="border-primary/30">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-card/30 border border-primary/20 rounded-lg p-8">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse-glow" />
          <h3 className="text-xl font-bold text-center mb-4">Document Authentication</h3>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            All sovereign documents are cryptographically signed and verified through the Empire's blockchain. 
            Each document contains embedded verification codes to ensure authenticity and prevent tampering.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Declarations;
