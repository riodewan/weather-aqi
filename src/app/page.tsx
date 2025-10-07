import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Weather & Air Quality (MVP)</h1>
        <Badge>dev</Badge>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Sanity Check UI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>Tailwind + shadcn/ui sudah terpasang.</p>
          <Button>Primary Button</Button>
        </CardContent>
      </Card>
    </main>
  );
}