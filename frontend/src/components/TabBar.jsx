import { cn } from "../lib/utils"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  MessageCircle,
  Upload,
  Wrench,
  HelpCircle,
  BookMarked,
  Library,
  Users,
  BarChart,
  School,
  GraduationCap,
  Briefcase,
  Search
} from "lucide-react"

const TabBar = ({ activeTab, setActiveTab, userRole }) => {
  const allTabs = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "uploads", label: "Uploads", icon: Upload },
    { id: "student-tools", label: "Student Tools", icon: GraduationCap },
    { id: "teacher-tools", label: "Teacher Tools", icon: Briefcase },
    { id: "management-tools", label: "Admin Tools", icon: Wrench },
    { id: "verifier-tools", label: "Verification", icon: Search },
    { id: "qna-forum", label: "Q&A Forum", icon: HelpCircle },
    { id: "assignments", label: "Assignments", icon: BookMarked },
    { id: "resource-library", label: "Resources", icon: Library },
    { id: "study-groups", label: "Study Groups", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart },
    { id: "university", label: "University", icon: School },
  ]

  // Role-based Access Control
  const rolePermissions = {
    student: ["chat", "student-tools", "qna-forum", "assignments", "resource-library", "study-groups"],
    faculty: ["chat", "uploads", "teacher-tools", "qna-forum", "assignments", "analytics", "resource-library"],
    verifier: ["chat", "uploads", "verifier-tools"], // Specialized verification suite
    admin: ["chat", "uploads", "student-tools", "teacher-tools", "management-tools", "qna-forum", "assignments", "resource-library", "study-groups", "analytics", "university"],
    management: ["chat", "analytics", "university", "management-tools"],
  }

  const tabs = allTabs.filter(tab => 
    !userRole || (rolePermissions[userRole] && rolePermissions[userRole].includes(tab.id))
  )

  return (
    <div className="w-full sticky top-0 z-50 pt-2 pb-1 px-2 sm:px-4">
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Floating container */}
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          {/* Scrollable tabs with fade effects */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              <TabsList 
                className="w-max min-w-full h-14 bg-transparent p-1.5 gap-1"
                style={{ scrollbarWidth: 'none' }}
              >
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "relative group rounded-lg px-3 sm:px-4 py-2.5 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-300",
                    "border border-transparent hover:bg-gray-50/80 dark:hover:bg-gray-800/30",
                    "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800/90",
                    "data-[state=active]:text-primary dark:data-[state=active]:text-blue-400",
                    "data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-gray-200 dark:data-[state=active]:ring-gray-700",
                    "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                    "flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2 whitespace-nowrap",
                    "flex-shrink-0 h-full px-2 sm:px-3",
                    "transition-colors duration-200 ease-in-out"
                  )}
                >
                  <div className="p-1.5 rounded-md bg-gray-100/50 dark:bg-gray-800/50 group-data-[state=active]:bg-blue-50 dark:group-data-[state=active]:bg-blue-900/20">
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-current" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
                  <span
                    className={cn(
                      "absolute inset-0 rounded-md ring-2 ring-primary/20 ring-offset-2",
                      "opacity-0 group-hover:opacity-30 group-focus-visible:opacity-50",
                      "transition-opacity duration-200",
                      "group-data-[state=active]:opacity-0"
                    )}
                    aria-hidden="true"
                  />
                </TabsTrigger>
              )
            })}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Active indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-10" />
        </div>
      </div>
    </div>
  )
}

export default TabBar
