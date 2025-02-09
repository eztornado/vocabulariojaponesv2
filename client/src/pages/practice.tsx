import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Word, type Category } from "@shared/schema";

export default function Practice() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"]
  });

  const { data: words } = useQuery<Word[]>({
    queryKey: ["/api/words", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/words?categoryId=${selectedCategory}`
        : "/api/words";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch words");
      return res.json();
    }
  });

  const currentWord = words?.[currentWordIndex];

  function nextWord() {
    setShowTranslation(false);
    if (words && currentWordIndex < words.length - 1) {
      setCurrentWordIndex(curr => curr + 1);
    } else {
      setCurrentWordIndex(0);
    }
  }

  if (!categories?.length) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No hay categorías disponibles
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-center">Práctica</h1>

          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {categories.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id.toString()}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCategory && words?.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No hay palabras en esta categoría
              </p>
            </CardContent>
          </Card>
        )}

        {currentWord && (
          <Card className="text-center">
            <CardContent className="pt-6 space-y-6">
              <div>
                <h2 className="text-4xl font-bold mb-2">{currentWord.japanese}</h2>
                <p className="text-xl text-muted-foreground">{currentWord.romaji}</p>
              </div>

              {showTranslation && (
                <div className="text-2xl font-medium">
                  {currentWord.spanish}
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  variant={showTranslation ? "outline" : "default"}
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                  {showTranslation ? "Ocultar" : "Mostrar"} Traducción
                </Button>
                <Button onClick={nextWord}>
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}