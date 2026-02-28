import { useCalculations } from "@/hooks/use-calculations";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock, Leaf, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
  const { data: calculations, isLoading } = useCalculations();

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Recent Calculations
          </h1>
          <p className="text-muted-foreground mt-1">Review your past field plans and organic requirements.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
          <p className="font-medium text-lg">Loading history...</p>
        </div>
      ) : calculations?.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Leaf className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No history yet</h3>
            <p className="text-muted-foreground max-w-md">
              You haven't generated any organic fertilizer plans yet. Head over to the calculator to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {calculations?.map((calc, idx) => (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    
                    {/* Left section: Date & Crop */}
                    <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-border/50 bg-secondary/30 group-hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mb-3">
                        <Calendar className="w-4 h-4" />
                        {calc.createdAt ? format(new Date(calc.createdAt), "MMM d, yyyy") : "Unknown Date"}
                      </div>
                      <h4 className="text-2xl font-display font-bold text-foreground mb-1">
                        {calc.crop.name}
                      </h4>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-white border font-medium text-sm text-muted-foreground shadow-sm">
                        {Number(calc.fieldSize)} Acres
                      </div>
                    </div>

                    {/* Right section: Results */}
                    <div className="p-6 md:w-2/3 flex flex-col sm:flex-row gap-6 sm:gap-12 md:px-10">
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Compost
                        </p>
                        <p className="text-3xl font-display font-bold text-foreground flex items-baseline gap-1">
                          {Number(calc.resultCompost).toLocaleString()} 
                          <span className="text-base font-normal text-muted-foreground">kg</span>
                        </p>
                      </div>

                      <div className="hidden sm:block w-px bg-border/50 self-stretch" />

                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Manure
                        </p>
                        <p className="text-3xl font-display font-bold text-foreground flex items-baseline gap-1">
                          {Number(calc.resultManure).toLocaleString()} 
                          <span className="text-base font-normal text-muted-foreground">kg</span>
                        </p>
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
