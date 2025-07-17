"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/components/auth/auth-provider"
import { hasPermission } from "@/lib/auth"
import {
  BarChart3,
  Calendar,
  ChevronDown,
  FileText,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Wrench,
  LogOut,
  ArrowRightLeft,
  Coffee,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  className?: string
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    requiredRole: "viewer",
  },
  {
    name: "Inventory",
    icon: Package,
    requiredRole: "viewer",
    children: [
      { name: "Items", href: "/inventory/items", requiredRole: "viewer" },
      { name: "Stock Levels", href: "/inventory/stock", requiredRole: "viewer" },
      { name: "Locations", href: "/inventory/locations", requiredRole: "manager" },
      { name: "Categories", href: "/inventory/categories", requiredRole: "manager" },
    ],
  },
  {
    name: "Purchase Orders",
    href: "/purchase-orders",
    icon: ShoppingCart,
    requiredRole: "operator",
  },
  {
    name: "Traspasos",
    href: "/transfers",
    icon: ArrowRightLeft,
    requiredRole: "operator",
  },
  {
    name: "Sales",
    href: "/sales",
    icon: FileText,
    requiredRole: "operator",
  },
  {
    name: "Production",
    icon: Wrench,
    requiredRole: "operator",
    children: [
      { name: "Recipes", href: "/production/recipes", requiredRole: "manager" },
      { name: "Production Orders", href: "/production/orders", requiredRole: "operator" },
      { name: "Work in Progress", href: "/production/wip", requiredRole: "operator" },
    ],
  },
  {
    name: "Suppliers",
    href: "/suppliers",
    icon: Truck,
    requiredRole: "manager",
  },
  {
    name: "Maintenance",
    href: "/maintenance",
    icon: Calendar,
    requiredRole: "operator",
  },
  {
    name: "Reports",
    icon: BarChart3,
    requiredRole: "viewer",
    children: [
      { name: "Inventory Reports", href: "/reports/inventory", requiredRole: "viewer" },
      { name: "Sales Reports", href: "/reports/sales", requiredRole: "viewer" },
      { name: "Purchase Reports", href: "/reports/purchases", requiredRole: "viewer" },
      { name: "Audit Logs", href: "/reports/audit", requiredRole: "manager" },
    ],
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    requiredRole: "admin",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    requiredRole: "manager",
  },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  const [openItems, setOpenItems] = useState<string[]>(["Inventory", "Production", "Reports"])

  const toggleItem = (name: string) => {
    setOpenItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const filteredNavigation = navigation.filter((item) => profile && hasPermission(profile.role, item.requiredRole))

  return (
    <div className={cn("flex h-full w-64 flex-col bg-gray-900", className)}>
      {/* Header */}
      <div className="flex h-16 items-center px-6">
        <Coffee className="h-8 w-8 text-blue-400" />
        <span className="ml-2 text-xl font-semibold text-white">RestaurantPro</span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1 py-4">
          {filteredNavigation.map((item) => {
            if (item.children) {
              const hasAccessibleChildren = item.children.some(
                (child) => profile && hasPermission(profile.role, child.requiredRole),
              )

              if (!hasAccessibleChildren) return null

              return (
                <Collapsible
                  key={item.name}
                  open={openItems.includes(item.name)}
                  onOpenChange={() => toggleItem(item.name)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </div>
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", openItems.includes(item.name) && "rotate-180")}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    {item.children
                      .filter((child) => profile && hasPermission(profile.role, child.requiredRole))
                      .map((child) => (
                        <Link key={child.href} href={child.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start pl-12 text-gray-400 hover:bg-gray-800 hover:text-white",
                              pathname === child.href && "bg-gray-800 text-white",
                            )}
                          >
                            {child.name}
                          </Button>
                        </Link>
                      ))}
                  </CollapsibleContent>
                </Collapsible>
              )
            }

            return (
              <Link key={item.href} href={item.href!}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white",
                    pathname === item.href && "bg-gray-800 text-white",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Menu */}
      <div className="border-t border-gray-800 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white">
              <Avatar className="mr-3 h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{profile?.full_name || "User"}</span>
                <span className="text-xs text-gray-400 capitalize">{profile?.role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
