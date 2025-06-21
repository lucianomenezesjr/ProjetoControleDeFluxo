// components/FuncoesUsuario.tsx
"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FuncoesUsuarioProps {
  value: string;
  onChange: (value: string) => void;
}

const funcoes = [
  { label: "Porteiro", value: "porteiro" },
  { label: "Diretor", value: "diretor" },
  { label: "Coordenador", value: "coordenador" },
  { label: "Opp", value: "opp" },
  { label: "Aqv", value: "aqv" },
  { label: "Bibliotecária", value: "bibliotecaria" },
  { label: "Docente", value: "docente" },
] as const;

export function FuncoesUsuario({ value, onChange }: FuncoesUsuarioProps) {
  return (
    <div className="grid gap-1">
      <Label className="text-sm font-medium">Função</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground"
            )}
          >
            {value
              ? funcoes.find((funcao) => funcao.value === value)?.label
              : "Selecione uma função"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Digite para buscar..." className="h-9" />
            <CommandList>
              <CommandEmpty>Nenhuma função encontrada.</CommandEmpty>
              <CommandGroup>
                {funcoes.map((funcao) => (
                  <CommandItem
                    key={funcao.value}
                    value={funcao.label}
                    onSelect={() => onChange(funcao.value)}
                  >
                    {funcao.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        funcao.value === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
