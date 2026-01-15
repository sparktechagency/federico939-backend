"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImages = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const user_1 = require("../enums/user");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getImages = (app) => {
    const uploadDir = path_1.default.join(process.cwd(), 'uploads');
    // ✅ Route 1: Serve files (including nested paths)
    app.get('/uploads/*', (req, res) => {
        const relativePath = req.params[0]; // e.g., "audio/file.mp3"
        if (!relativePath)
            return res.status(400).send('File path is required');
        const filePath = path_1.default.resolve(uploadDir, relativePath);
        if (!filePath.startsWith(uploadDir)) {
            return res.status(400).send('Invalid file path');
        }
        // ✅ Check file existence before sending
        fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).send('File not found');
            }
            res.sendFile(filePath);
        });
    });
    // ✅ Route 2: List all uploaded image files (recursively)
    app.get('/uploads', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), (req, res) => {
        const imageFiles = [];
        const readRecursive = (dir, basePath = '') => {
            const items = fs_1.default.readdirSync(dir, { withFileTypes: true });
            items.forEach((item) => {
                const fullPath = path_1.default.join(dir, item.name);
                const relative = path_1.default.join(basePath, item.name);
                if (item.isDirectory()) {
                    readRecursive(fullPath, relative);
                }
                else {
                    const ext = path_1.default.extname(item.name).toLowerCase();
                    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
                        imageFiles.push(relative);
                    }
                }
            });
        };
        try {
            readRecursive(uploadDir);
            res.json({ files: imageFiles });
        }
        catch (err) {
            console.error('Failed to read uploads:', err.message);
            res.status(500).send('Failed to read uploads');
        }
    });
    // ✅ Route 3: Delete file (supports nested paths)
    app.delete('/uploads/*', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), (req, res) => {
        const relativePath = req.params[0];
        if (!relativePath)
            return res.status(400).send('File path is required');
        const filePath = path_1.default.resolve(uploadDir, relativePath);
        if (!filePath.startsWith(uploadDir)) {
            return res.status(400).send('Invalid file path');
        }
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err.message);
                return res.status(404).send('File not found or already deleted');
            }
            res.redirect('/uploads');
        });
    });
};
exports.getImages = getImages;
