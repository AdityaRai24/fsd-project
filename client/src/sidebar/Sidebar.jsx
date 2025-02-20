import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const data = {
  teams: [
    {
      name: "Full Stack Development",
      logo: GalleryVerticalEnd,
    },
    {
      name: "Devops",
      logo: AudioWaveform,
    },
  ],
  navMain: [
    "Experiment 1",
    "Experiment 2",
    "Experiment 3",
    "Experiment 4",
    "Experiment 5",
    "Experiment 6",
    "Experiment 7",
    "Experiment 8",
    "Experiment 9",
    "Experiment 10",
  ],
};

export function AppSidebar({ teacher,...props}) {

  const [searchParams] = useSearchParams()
  const subject = searchParams.get("sub");
  const currentTeam = data.teams.find((team) => team.name === subject);
  const [activeTeam, setActiveTeam] = useState(currentTeam ? currentTeam : data.teams[1]);

  const navigate = useNavigate()

  const handleSubChange = (team) => {
    setActiveTeam(team);
    navigate(`/teacher-dashboard?exp=1&sub=`+team.name);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher activeTeam={activeTeam} handleSubChange={handleSubChange} teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain subject={activeTeam} items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser teacher={teacher} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
