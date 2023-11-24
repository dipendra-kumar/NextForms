"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs";

class UserNotFoundError extends Error {}

export async function getFormStats() {
  const user = await currentUser();
  if (!user) throw new UserNotFoundError();

  const stats = prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });
  const visits = (await stats)._sum.visits || 0;
  const submissions = (await stats)._sum.submissions || 0;
  let submissionRate = 0;
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }
  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function createForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) throw new Error("Form not valid");

  const user = await currentUser();
  if (!user) throw new UserNotFoundError();

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });
  if (!form) throw new Error("Something went wrong");
  return form.id;
}

export async function getForms() {
  const user = await currentUser();
  if (!user) throw new UserNotFoundError();

  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getFromById(id: number) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundError();

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function updateForm(id: number, jsonString: string) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundError();

  return await prisma.form.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      content: jsonString,
    },
  });
}

export async function publishForm(id: number) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundError();

  return await prisma.form.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      published: true,
    },
  });
}
