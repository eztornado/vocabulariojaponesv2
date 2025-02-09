import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWordSchema, type Word, type Category } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Trash2 } from "lucide-react";

type FormValues = {
  japanese: string;
  romaji: string;
  spanish: string;
  categoryId: number | undefined;
};

export default function Words() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(insertWordSchema),
    defaultValues: {
      japanese: "",
      romaji: "",
      spanish: "",
      categoryId: undefined
    }
  });

  const { data: words } = useQuery<Word[]>({
    queryKey: ["/api/words"]
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"]
  });

  const createWord = useMutation({
    mutationFn: (values: FormValues) => 
      apiRequest("POST", "/api/words", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/words"] });
      toast({ title: "Palabra añadida" });
    }
  });

  const deleteWord = useMutation({
    mutationFn: (id: number) => 
      apiRequest("DELETE", `/api/words/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/words"] });
      toast({ title: "Palabra eliminada" });
    }
  });

  async function onSubmit(values: FormValues) {
    await createWord.mutateAsync(values);
    form.reset();
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Palabras</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Palabra
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Palabra</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="japanese"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Japonés</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="romaji"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Romaji</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spanish"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Español</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem 
                                key={category.id} 
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Crear</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Japonés</TableHead>
              <TableHead>Romaji</TableHead>
              <TableHead>Español</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words?.map((word) => (
              <TableRow key={word.id}>
                <TableCell>{word.japanese}</TableCell>
                <TableCell>{word.romaji}</TableCell>
                <TableCell>{word.spanish}</TableCell>
                <TableCell>
                  {categories?.find(c => c.id === word.categoryId)?.name}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteWord.mutate(word.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}