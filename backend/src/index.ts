import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { seed } from "./seeder";
import cors from "cors";

const prisma = new PrismaClient();

const app = express();

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.json({ message: "It works!!" });
});

app.get("/users", async (req: Request, res) => {
  const pageSize = parseInt((req.query["size"] as string) || "100") || 100;
  const pageNumber = parseInt((req.query["page"] as string) || "0") || 0;
  const total = await prisma.user.count();
  const totalPage = Math.ceil(total / pageSize);
  const skip = pageSize * pageNumber;

  const data = await prisma.user.findMany({
    skip,
    take: pageSize,
    orderBy: {
      id: "desc",
    },
  });

  const count = data.length;

  res.json({
    pageSize,
    total,
    pageNumber,
    totalPage,
    count,
    data,
  });
});

app.get("/all-users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ data: users, count: users.length });
});

app.listen(5000, () => {
  console.log("Backend is running at http://localhost:5000");

  // if data is not present then run seeder
  seed();
});
