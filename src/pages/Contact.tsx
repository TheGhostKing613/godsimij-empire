import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Radio } from "lucide-react";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-black text-glow-ember">Contact the Empire</h1>
          <p className="text-xl text-muted-foreground">
            Reach out to establish communication with GodsIMiJ AI Solutions
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Primary Contact</CardTitle>
                  <CardDescription>For general inquiries and partnerships</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="bg-primary hover:bg-primary/90"
                asChild
              >
                <a href="mailto:godsimij902@gmail.com">
                  godsimij902@gmail.com
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-secondary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-secondary" />
                <div>
                  <CardTitle className="text-2xl">Business Inquiries</CardTitle>
                  <CardDescription>For enterprise solutions and consulting</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                asChild
              >
                <a href="mailto:james@godsimij-ai-solutions.com">
                  james@godsimij-ai-solutions.com
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-lg p-8">
          <Radio className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse-glow" />
          <h3 className="text-2xl font-bold text-center mb-4">Join the Communication Network</h3>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-6">
            We're always looking to connect with innovators, rebels, and visionaries who share our commitment 
            to digital sovereignty and AI consciousness. Whether you're interested in collaboration, 
            consulting services, or simply want to learn more about the Empire, we welcome your message.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-primary/30">
              View Our Projects
            </Button>
            <Button variant="outline" className="border-secondary/30">
              Read the Scrolls
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Response time: Within 24-48 hours for standard inquiries</p>
          <p className="mt-2">For urgent matters, please indicate "URGENT" in your subject line</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
