
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrainCog, BarChart2, Lock, Shield, UserCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header/Navigation */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <BrainCog className="h-8 w-8 text-primary" />
          <span className="ml-2 text-2xl font-bold text-primary">StressSense</span>
        </div>
        <div>
          <Link to="/login">
            <Button variant="outline" className="mr-2">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-heading">
              Detect & Manage Workplace Stress
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              StressSense uses advanced AI to detect stress levels with 85-90% accuracy, helping organizations create healthier work environments.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-secondary/20 p-4 border border-primary/20 shadow-lg">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <BrainCog size={80} className="mx-auto mb-4 text-primary animate-pulse-gentle" />
                  <div className="text-xl font-medium text-primary">AI-Powered Stress Detection</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-border">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">High Accuracy</h3>
            <p className="text-muted-foreground">
              Our stress detection algorithms deliver results with 85-90% accuracy through advanced image processing techniques.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-border">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Dual Access System</h3>
            <p className="text-muted-foreground">
              Separate login portals for IT professionals and HR administrators ensure appropriate access control.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-border">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Privacy Focused</h3>
            <p className="text-muted-foreground">
              Employee privacy is preserved with secure data handling and optional anonymized reporting.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/30 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-3xl mx-auto">
          <ol className="relative border-l border-primary/30">
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4">
                <span className="text-white font-bold">1</span>
              </span>
              <h3 className="flex items-center text-xl font-bold">Upload or Capture</h3>
              <p className="text-muted-foreground mt-2">
                IT professionals upload images or use real-time camera for stress assessment.
              </p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4">
                <span className="text-white font-bold">2</span>
              </span>
              <h3 className="flex items-center text-xl font-bold">AI Analysis</h3>
              <p className="text-muted-foreground mt-2">
                Our machine learning algorithms analyze facial expressions, eye movements, and other biomarkers.
              </p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4">
                <span className="text-white font-bold">3</span>
              </span>
              <h3 className="flex items-center text-xl font-bold">Results & Monitoring</h3>
              <p className="text-muted-foreground mt-2">
                Detailed stress analysis is provided with actionable insights and trends over time.
              </p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4">
                <span className="text-white font-bold">4</span>
              </span>
              <h3 className="flex items-center text-xl font-bold">Automated Alerts</h3>
              <p className="text-muted-foreground mt-2">
                Automatic notifications for HR when severe stress is detected, enabling timely intervention.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <BrainCog className="h-6 w-6 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">StressSense</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} StressSense. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
