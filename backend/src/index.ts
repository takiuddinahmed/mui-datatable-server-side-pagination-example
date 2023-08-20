import express from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { seed } from "./seeder";

const prisma = new PrismaClient();

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "It works!!" });
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
