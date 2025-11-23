import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import auth from '../middlewares/auth';
import { USER_ROLES } from '../enums/user';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getImages = (app: any) => {
  const uploadDir = path.join(process.cwd(), 'uploads');

  // ✅ Route 1: Serve files (including nested paths)
  app.get('/uploads/*', (req: Request, res: Response) => {
    const relativePath = req.params[0]; // e.g., "audio/file.mp3"
    if (!relativePath) return res.status(400).send('File path is required');

    const filePath = path.resolve(uploadDir, relativePath);
    if (!filePath.startsWith(uploadDir)) {
      return res.status(400).send('Invalid file path');
    }

    // ✅ Check file existence before sending
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send('File not found');
      }
      res.sendFile(filePath);
    });
  });

  // ✅ Route 2: List all uploaded image files (recursively)
  app.get('/uploads', auth(USER_ROLES.SUPER_ADMIN), (req: Request, res: Response) => {
    const imageFiles: string[] = [];

    const readRecursive = (dir: string, basePath = '') => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      items.forEach((item) => {
        const fullPath = path.join(dir, item.name);
        const relative = path.join(basePath, item.name);
        if (item.isDirectory()) {
          readRecursive(fullPath, relative);
        } else {
          const ext = path.extname(item.name).toLowerCase();
          if (
            ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)
          ) {
            imageFiles.push(relative);
          }
        }
      });
    };

    try {
      readRecursive(uploadDir);
      res.json({ files: imageFiles });
    } catch (err) {
      console.error('Failed to read uploads:', (err as Error).message);
      res.status(500).send('Failed to read uploads');
    }
  });

  // ✅ Route 3: Delete file (supports nested paths)
  app.delete(
    '/uploads/*',
    auth(USER_ROLES.SUPER_ADMIN),
    (req: Request, res: Response) => {
      const relativePath = req.params[0];
      if (!relativePath) return res.status(400).send('File path is required');

      const filePath = path.resolve(uploadDir, relativePath);
      if (!filePath.startsWith(uploadDir)) {
        return res.status(400).send('Invalid file path');
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err.message);
          return res.status(404).send('File not found or already deleted');
        }
        res.redirect('/uploads');
      });
    },
  );
};
