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
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const defaultData = {
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

export function AppSidebar({ teacher, ...props }) {
  const [searchParams] = useSearchParams();
  const [teamsData, setTeamsData] = useState(null);
  const subject = searchParams.get("sub");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("allData"));
      if (
        storedData &&
        storedData.batches &&
        storedData.batches[0] &&
        storedData.batches[0].subjects
      ) {
        setTeamsData(storedData.batches[0].subjects);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setTeamsData(defaultData.teams);
    }
  }, []);

  const subjectsWithLogos = useMemo(() => {
    if (!teamsData) return [];
    const icons = [
      GalleryVerticalEnd,
      AudioWaveform,
      BookOpen,
      Bot,
      Command,
      Frame,
      Map,
      PieChart,
      Settings2,
      SquareTerminal,
    ];
    return teamsData.map((subject, index) => ({
      ...subject,
      logo: icons[index % icons.length],
    }));
  }, [teamsData]);

  const [activeTeam, setActiveTeam] = useState(null);

  useEffect(() => {
    if (subjectsWithLogos.length > 0) {
      const currentTeam = subject
        ? subjectsWithLogos.find((team) => team.name === subject)
        : subjectsWithLogos[0];

      setActiveTeam(currentTeam || subjectsWithLogos[0]);
    }
  }, [subject, subjectsWithLogos]);

  const handleSubChange = (team) => {
    setActiveTeam(team);
    navigate(`/teacher-dashboard?exp=1&sub=${team.name}`);
  };

  if (!teamsData || !activeTeam) {
    return <div>Loading...</div>;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          activeTeam={activeTeam}
          handleSubChange={handleSubChange}
          teams={subjectsWithLogos}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain subject={activeTeam} items={defaultData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser teacher={teacher} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
