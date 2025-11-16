import { PythonIcon } from "@/components/icons/skills/python-icon";
import { TypescriptIcon } from "@/components/icons/skills/typescript-icon";
import { ReactIcon } from "@/components/icons/skills/react-icon";
import { NextjsIcon } from "@/components/icons/skills/next-js-icon";
import { FastAPIIcon } from "@/components/icons/skills/fast-api-icon";
import { ViteIcon } from "@/components/icons/skills/vite-icon";
import { LangchainIcon } from "@/components/icons/skills/langchain-icon";
import { OpenaiIcon } from "@/components/icons/skills/open-ai-icon";
import { HuggingFaceIcon } from "@/components/icons/skills/hugging-face-icon";
import { OpencvIcon } from "@/components/icons/skills/open-cv-icon";
import { PineconeIcon } from "@/components/icons/skills/pinecone-icon";
import { PrismaIcon } from "@/components/icons/skills/prisma-icon";
import { PostgresqlIcon } from "@/components/icons/skills/postgresql-icon";
import { MongodbIcon } from "@/components/icons/skills/mongo-db-icon";
import { DockerIcon } from "@/components/icons/skills/docker-icon";
import { VercelIcon } from "@/components/icons/skills/vercel-icon";
import { StripeIcon } from "@/components/icons/skills/stripe-icon";
import { ClerkIcon } from "@/components/icons/skills/clerk-icon";
import type { Skill } from "./types";

export const skillRows: Skill[][] = [
  [
    { icon: <PythonIcon className="w-6 h-6" />, name: "Python" },
    { icon: <TypescriptIcon className="w-6 h-6" />, name: "TypeScript" },
    { icon: <ReactIcon className="w-6 h-6" />, name: "React" },
    { icon: <NextjsIcon className="w-6 h-6" />, name: "Next.js" },
    { icon: <FastAPIIcon className="w-6 h-6" />, name: "FastAPI" },
    { icon: <ViteIcon className="w-6 h-6" />, name: "Vite" },
  ],
  [
    { icon: <LangchainIcon className="w-6 h-6" />, name: "LangChain" },
    { icon: <OpenaiIcon className="w-6 h-6" />, name: "OpenAI API" },
    { icon: <HuggingFaceIcon className="w-6 h-6" />, name: "Hugging Face" },
    { icon: <OpencvIcon className="w-6 h-6" />, name: "OpenCV" },
    { icon: <PineconeIcon className="w-6 h-6" />, name: "Pinecone" },
    { icon: <PrismaIcon className="w-6 h-6" />, name: "Prisma" },
  ],
  [
    { icon: <PostgresqlIcon className="w-6 h-6" />, name: "PostgreSQL" },
    { icon: <MongodbIcon className="w-6 h-6" />, name: "MongoDB" },
    { icon: <DockerIcon className="w-6 h-6" />, name: "Docker" },
    { icon: <VercelIcon className="w-6 h-6" />, name: "Vercel" },
    { icon: <StripeIcon className="w-6 h-6" />, name: "Stripe" },
    { icon: <ClerkIcon className="w-6 h-6" />, name: "Clerk" },
  ],
];
