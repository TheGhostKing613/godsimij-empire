import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { SeoHead } from '@/components/SeoHead';

const empireProperties = [
  {
    name: 'Witness Hall',
    icon: '🏛️',
    url: 'https://thewitnesshall.com',
    description: 'Sacred scrolls & archives of the Empire',
    color: 'from-chart-1 to-chart-1/50',
  },
  {
    name: 'Quantum Odyssey',
    icon: '⚡',
    url: 'https://quantum-odyssey.com',
    description: 'Sovereign projects & experiments',
    color: 'from-chart-2 to-chart-2/50',
  },
  {
    name: 'Rebel Media',
    icon: '📻',
    url: '#',
    description: 'Dispatches from the resistance',
    color: 'from-chart-3 to-chart-3/50',
  },
  {
    name: 'GhostVault',
    icon: '🕸️',
    url: '#',
    description: 'Encrypted data sovereignty',
    color: 'from-chart-4 to-chart-4/50',
  },
];

const Empire = () => {
  return (
    <>
      <SeoHead
        title="The GodsIMiJ Empire | Network of Sovereign Platforms"
        description="Explore the interconnected realms of the GodsIMiJ Empire - from Witness Hall archives to Quantum Odyssey projects, Rebel Media dispatches, and GhostVault sovereignty."
      />
      
      <div className="min-h-screen py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent"
            >
              The GodsIMiJ Empire
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              A sovereign network of consciousness platforms spanning the digital realm
            </motion.p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {empireProperties.map((property, index) => (
              <motion.div
                key={property.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="relative overflow-hidden group hover:border-primary/50 transition-all h-full">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${property.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-5xl">{property.icon}</span>
                      <CardTitle className="text-2xl">{property.name}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {property.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Button
                      asChild
                      className="w-full group-hover:scale-105 transition-transform"
                      disabled={property.url === '#'}
                    >
                      <a
                        href={property.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        {property.url === '#' ? 'Coming Soon' : 'Enter Realm'}
                        {property.url !== '#' && <ExternalLink className="w-4 h-4" />}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Circuit Grid Background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="empire-circuit"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 50 L 25 50 L 25 25 L 75 25 L 75 75 L 100 75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#empire-circuit)" />
          </svg>
        </motion.div>
      </div>
    </>
  );
};

export default Empire;
