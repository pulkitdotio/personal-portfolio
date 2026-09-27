import cssSvg from "simple-icons/icons/css.svg?raw";
import dockerSvg from "simple-icons/icons/docker.svg?raw";
import expressSvg from "simple-icons/icons/express.svg?raw";
import gitSvg from "simple-icons/icons/git.svg?raw";
import githubSvg from "simple-icons/icons/github.svg?raw";
import htmlSvg from "simple-icons/icons/html5.svg?raw";
import javascriptSvg from "simple-icons/icons/javascript.svg?raw";
import mongodbSvg from "simple-icons/icons/mongodb.svg?raw";
import nextSvg from "simple-icons/icons/nextdotjs.svg?raw";
import nodeSvg from "simple-icons/icons/nodedotjs.svg?raw";
import javaSvg from "simple-icons/icons/openjdk.svg?raw";
import pandasSvg from "simple-icons/icons/pandas.svg?raw";
import postgresqlSvg from "simple-icons/icons/postgresql.svg?raw";
import postmanSvg from "simple-icons/icons/postman.svg?raw";
import pythonSvg from "simple-icons/icons/python.svg?raw";
import reactSvg from "simple-icons/icons/react.svg?raw";
import redisSvg from "simple-icons/icons/redis.svg?raw";
import scikitLearnSvg from "simple-icons/icons/scikitlearn.svg?raw";
import shadcnSvg from "simple-icons/icons/shadcnui.svg?raw";
import supabaseSvg from "simple-icons/icons/supabase.svg?raw";
import tailwindSvg from "simple-icons/icons/tailwindcss.svg?raw";
import tensorflowSvg from "simple-icons/icons/tensorflow.svg?raw";
import typescriptSvg from "simple-icons/icons/typescript.svg?raw";
import vercelSvg from "simple-icons/icons/vercel.svg?raw";
import type { TechnologyIconName } from "./portfolio";

function getIconPath(svg: string) {
  const path = svg.match(/<path d="([^"]+)"/)?.[1];

  if (!path) {
    throw new Error("Simple Icon SVG is missing its path data.");
  }

  return path;
}

export const brandIconPaths: Partial<Record<TechnologyIconName, string>> = {
  typescript: getIconPath(typescriptSvg),
  javascript: getIconPath(javascriptSvg),
  python: getIconPath(pythonSvg),
  java: getIconPath(javaSvg),
  html: getIconPath(htmlSvg),
  css: getIconPath(cssSvg),
  react: getIconPath(reactSvg),
  nextjs: getIconPath(nextSvg),
  tailwind: getIconPath(tailwindSvg),
  shadcn: getIconPath(shadcnSvg),
  nodejs: getIconPath(nodeSvg),
  express: getIconPath(expressSvg),
  postgresql: getIconPath(postgresqlSvg),
  mongodb: getIconPath(mongodbSvg),
  redis: getIconPath(redisSvg),
  supabase: getIconPath(supabaseSvg),
  tensorflow: getIconPath(tensorflowSvg),
  pandas: getIconPath(pandasSvg),
  "scikit-learn": getIconPath(scikitLearnSvg),
  git: getIconPath(gitSvg),
  github: getIconPath(githubSvg),
  docker: getIconPath(dockerSvg),
  postman: getIconPath(postmanSvg),
  vercel: getIconPath(vercelSvg),
};

export const githubIconPath = getIconPath(githubSvg);
