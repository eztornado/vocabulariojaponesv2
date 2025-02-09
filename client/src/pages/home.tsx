import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, List, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Vocabulario Japonés</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-6 w-6" />
                Categorías
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Gestiona las categorías de palabras</p>
              <Link href="/categories">
                <Button className="w-full">Ir a Categorías</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-6 w-6" />
                Palabras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Añade y edita palabras</p>
              <Link href="/words">
                <Button className="w-full">Ir a Palabras</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-6 w-6" />
                Practicar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Practica el vocabulario</p>
              <Link href="/practice">
                <Button className="w-full">Comenzar Práctica</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
