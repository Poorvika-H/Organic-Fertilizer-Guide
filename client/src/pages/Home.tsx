import { Link } from "wouter";
import { ArrowRight, Leaf, Sprout, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 -z-10" />

        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-6 max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary w-fit border border-primary/20">
                <Leaf className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">Sustainable Farming</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1]">
                Grow better with <span className="text-primary relative inline-block">
                  organic insights
                  <div className="absolute bottom-2 left-0 w-full h-3 bg-accent/40 -z-10 rounded-sm"></div>
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Reduce chemical dependency and improve soil health. Calculate precise organic fertilizer requirements tailored to your crops and field size.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/calculator" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 px-8 rounded-full text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                    Start Calculating <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/history" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full h-14 px-8 rounded-full text-lg border-2 hover:bg-primary/5">
                    View History
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:ml-auto"
            >
              {/* lovely lush green agricultural field from Unsplash */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white/50 transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80" 
                  alt="Lush green agricultural field" 
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 z-20 glass rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">Boost Yield</p>
                    <p className="text-sm text-foreground/70">Naturally & sustainably</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features snippet */}
      <section className="bg-white py-20 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-secondary/50 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Crop Specific</h3>
              <p className="text-muted-foreground">Tailored recommendations based on the unique nutrient requirements of what you're growing.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-secondary/50 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 text-accent-foreground flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Organic First</h3>
              <p className="text-muted-foreground">Shift away from synthetic chemicals towards sustainable compost and manure solutions.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-secondary/50 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Healthier Soil</h3>
              <p className="text-muted-foreground">Improve soil microbiology and long-term viability by using the right organic balance.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
