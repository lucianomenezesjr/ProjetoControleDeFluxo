"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  IconUsers,
  IconUsersGroup,
  type Icon,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { DropdownMenuTurma } from "./DropdownTurma"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/Usuarios">
                <IconUsers className="size-5" /> 
                <span>Lista de usuários</span>
                
              </a>
            </SidebarMenuButton>
            <SidebarMenuButton asChild>
                <div>
                    <IconUsersGroup className="size-5" /> 
                    <DropdownMenuTurma />
                </div>
            
              
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-24 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <IconFolder />
                  <span>Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconShare3 />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <IconTrash />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        
      </SidebarMenu>
    </SidebarGroup>
  )
}
