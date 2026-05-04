import fs from "fs";
import path from "path";

export const getAbsoluteFilePath = (relativeFilePath: string) => {
  return path.resolve(process.cwd(), relativeFilePath);
};

export const deleteLocalFile = async (relativeFilePath?: string) => {
  if (!relativeFilePath) return;

  const fullPath = getAbsoluteFilePath(relativeFilePath);

  try {
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (error) {
    console.error("Could not delete file:", fullPath, error);
  }
};
