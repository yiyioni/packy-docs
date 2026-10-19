import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
    {
      text: "快速开始",
      icon: "rocket",
      link: "/docs/register/",
    },
    {
      text: "PackyAPI 官网",
      icon: "link",
      link: "https://www.packyapi.ai",
    },
    {
      text: "Packy服务监控",
      icon: "material-symbols:monitoring-rounded",
      link: "https://check.linux.do/group/Packy",
    },
]);

export const enNavbar = navbar([
    {
      text: "Getting Started",
      icon: "rocket",
      link: "/en/docs/",
    },
    {
      text: "PackyAPI Website",
      icon: "link",
      link: "https://www.packyapi.ai",
    },
    {
      text: "Service Status",
      icon: "material-symbols:monitoring-rounded",
      link: "https://check.linux.do/group/Packy",
    },
]);

export default zhNavbar;
