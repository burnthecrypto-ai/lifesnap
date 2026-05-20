import { Router } from "express";
import { db, snapshotsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateSnapshotBody, GetSnapshotParams, DeleteSnapshotParams } from "@workspace/api-zod";

const router = Router();

router.get("/snapshots", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(snapshotsTable)
      .orderBy(snapshotsTable.createdAt);
    res.json(rows.map(rowToSnapshot));
  } catch (err) {
    req.log.error({ err }, "Failed to list snapshots");
    res.status(500).json({ error: "Failed to list snapshots" });
  }
});

router.post("/snapshots", async (req, res) => {
  const parsed = CreateSnapshotBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid snapshot data" });
    return;
  }

  const { title, originalText, mode, diaryEntry, snapshot } = parsed.data;

  try {
    const [row] = await db
      .insert(snapshotsTable)
      .values({
        title: title ?? null,
        originalText,
        mode,
        diaryEntry: diaryEntry as Record<string, unknown>,
        snapshot: snapshot as Record<string, unknown>,
      })
      .returning();

    res.status(201).json(rowToSnapshot(row));
  } catch (err) {
    req.log.error({ err }, "Failed to save snapshot");
    res.status(500).json({ error: "Failed to save snapshot" });
  }
});

router.get("/snapshots/:id", async (req, res) => {
  const params = GetSnapshotParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const [row] = await db
      .select()
      .from(snapshotsTable)
      .where(eq(snapshotsTable.id, params.data.id));

    if (!row) {
      res.status(404).json({ error: "Snapshot not found" });
      return;
    }

    res.json(rowToSnapshot(row));
  } catch (err) {
    req.log.error({ err }, "Failed to get snapshot");
    res.status(500).json({ error: "Failed to get snapshot" });
  }
});

router.delete("/snapshots/:id", async (req, res) => {
  const params = DeleteSnapshotParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    await db
      .delete(snapshotsTable)
      .where(eq(snapshotsTable.id, params.data.id));

    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete snapshot");
    res.status(500).json({ error: "Failed to delete snapshot" });
  }
});

function rowToSnapshot(row: typeof snapshotsTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    originalText: row.originalText,
    mode: row.mode,
    diaryEntry: row.diaryEntry,
    snapshot: row.snapshot,
    createdAt: row.createdAt.toISOString(),
  };
}

export default router;
