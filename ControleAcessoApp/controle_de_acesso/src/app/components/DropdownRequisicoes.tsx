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


export function DropdownMenuRequisicoes() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span>Requisições</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/RequisicoesDeAcesso/Adicionar">Adicionar</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/RequisicoesDeAcesso">Visualizar</Link>
            
          </DropdownMenuItem>

          
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
