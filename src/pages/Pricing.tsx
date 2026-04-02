import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="py-16 px-4 bg-muted/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Choose the right plan for your Indian business needs. All plans include full access to our AI-powered startup advisory platform.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Monthly Plan */}
              <Card className="relative hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Monthly</CardTitle>
                  <div className="text-4xl font-bold text-primary">₹399</div>
                  <p className="text-muted-foreground">per month</p>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="text-foreground">✓ Full AI advisory access</li>
                    <li className="text-foreground">✓ Unlimited queries</li>
                    <li className="text-foreground">✓ Priority support</li>
                    <li className="text-foreground">✓ Cancel anytime</li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>

              {/* 3 Months Plan */}
              <Card className="relative border-2 border-primary shadow-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">Most Popular</Badge>
                </div>
                <CardHeader className="text-center pt-6">
                  <CardTitle className="text-2xl">3 Months</CardTitle>
                  <div className="text-4xl font-bold text-primary">₹699</div>
                  <p className="text-muted-foreground">one-time payment</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Save ₹497 vs monthly</p>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="text-foreground">✓ Full AI advisory access</li>
                    <li className="text-foreground">✓ Unlimited queries</li>
                    <li className="text-foreground">✓ Priority support</li>
                    <li className="text-foreground">✓ 3-month commitment</li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>

              {/* Yearly Plan */}
              <Card className="relative hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Yearly</CardTitle>
                  <div className="text-4xl font-bold text-primary">₹999</div>
                  <p className="text-muted-foreground">one-time payment</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Save ₹4,788 vs monthly</p>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="text-foreground">✓ Full AI advisory access</li>
                    <li className="text-foreground">✓ Unlimited queries</li>
                    <li className="text-foreground">✓ Priority support</li>
                    <li className="text-foreground">✓ Annual commitment</li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground mb-8">
                All prices in INR. Taxes may apply. Enterprise plans available upon request.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Need a Custom Plan?</h3>
                <p className="text-sm text-blue-700 dark:text-blue-200 mb-4">
                  Contact our sales team for enterprise solutions tailored to your specific needs.
                </p>
                <Button variant="outline" className="hover:bg-white dark:hover:bg-slate-900">Contact Sales</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;