"use strict";
// import fs from 'fs';
// import path from 'path';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const unlinkFile = (file: string) => {
//      const filePath = path.join('uploads', file);
//      if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//      }
// };
// export default unlinkFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const unlinkFile = (file) => {
    // Check if the file parameter is a string or an array
    if (typeof file === 'string') {
        // If it's a single string (file path), unlink the file
        const filePath = path_1.default.join('uploads', file);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            console.log(`File ${file} deleted successfully.`);
        }
        else {
            console.log(`File ${file} not found.`);
        }
    }
    else if (Array.isArray(file)) {
        // If it's an array of file paths, loop through the array and unlink each file
        file.forEach((singleFile) => {
            const filePath = path_1.default.join('uploads', singleFile);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
                console.log(`File ${singleFile} deleted successfully.`);
            }
            else {
                console.log(`File ${singleFile} not found.`);
            }
        });
    }
    else {
        console.log('Invalid input. Expected a string or an array of strings.');
    }
};
exports.default = unlinkFile;
