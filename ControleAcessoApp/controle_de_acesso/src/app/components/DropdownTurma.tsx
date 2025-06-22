import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";


export function DropdownMenuTurma() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span>Turma</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/Turmas/Adicionar">Adicionar</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/Turmas">Visualizar</Link>
            
          </DropdownMenuItem>

          
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
