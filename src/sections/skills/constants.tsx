import {
    PythonIcon,
    TypescriptIcon,
    ReactIcon,
    NextjsIcon,
    FastAPIIcon,
    ViteIcon,
    LangchainIcon,
    OpenaiIcon,
    HuggingFaceIcon,
    OpencvIcon,
    PineconeIcon,
    PrismaIcon,
    PostgresqlIcon,
    MongodbIcon,
    DockerIcon,
    VercelIcon,
    StripeIcon,
    ClerkIcon,
  } from "./icons";
  import type { Skill } from "./types";
  
  // Flattened skills data for grid layout
  export const skillsData: Skill[] = [
    // Row 1
    { name: "Python", icon: <PythonIcon className="w-12 h-12" /> },
    { name: "LangChain", icon: <LangchainIcon className="w-12 h-12" /> },
    { name: "Hugging Face", icon: <HuggingFaceIcon className="w-12 h-12" /> },
    { name: "OpenAI API", icon: <OpenaiIcon className="w-12 h-12" /> },
    { name: "OpenCV", icon: <OpencvIcon className="w-12 h-12" /> },
    { name: "FastAPI", icon: <FastAPIIcon className="w-12 h-12" /> },
    // Row 2
    { name: "TypeScript", icon: <TypescriptIcon className="w-12 h-12" /> },
    { name: "React", icon: <ReactIcon className="w-12 h-12" /> },
    { name: "Next.js", icon: <NextjsIcon className="w-12 h-12" /> },
    { name: "Vite", icon: <ViteIcon className="w-12 h-12" /> },
    { name: "PostgreSQL", icon: <PostgresqlIcon className="w-12 h-12" /> },
    { name: "Prisma", icon: <PrismaIcon className="w-12 h-12" /> },
    // Row 3
    { name: "MongoDB", icon: <MongodbIcon className="w-12 h-12" /> },
    { name: "Pinecone", icon: <PineconeIcon className="w-12 h-12" /> },
    { name: "Docker", icon: <DockerIcon className="w-12 h-12" /> },
    { name: "Vercel", icon: <VercelIcon className="w-12 h-12" /> },
    { name: "Stripe", icon: <StripeIcon className="w-12 h-12" /> },
    { name: "Clerk", icon: <ClerkIcon className="w-12 h-12" /> },
  ];