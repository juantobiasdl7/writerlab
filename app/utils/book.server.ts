import type { Book, User, Outline } from "@prisma/client";
import { prisma } from "./db.server"

export async function createBook({
  title,
  authorId,
}: Pick<Book, "title"> & { authorId: User["id"] }) {
  return prisma.book.create({
    data: {
      title,
      content: "",
      authorId,
    },
  });
}

export async function getBooksByAuthorId(authorId: User["id"]) {
  return prisma.book.findMany({
    where: { authorId },
    select: { id: true, title: true, previewImage: true },
  });
}

export async function getBookById(id: Book["id"]) {
  return prisma.book.findUnique({
    where: { id },
    include: { outline: { orderBy: { position: "asc" } } },
  });
}

export async function createOutlineItem({
    title,
    level,
    position,
    bookId,
  }: Pick<Outline, "title" | "level" | "position"> & { bookId: Book["id"] }) {
    return prisma.outline.create({
      data: {
        title,
        level,
        position,
        bookId,
      },
    });
  }