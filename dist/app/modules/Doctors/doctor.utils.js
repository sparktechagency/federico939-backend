"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanQuery = void 0;
const cleanQuery = (query) => {
    const cleaned = {};
    Object.entries(query).forEach(([key, value]) => {
        if (value !== null &&
            value !== undefined &&
            value !== '' &&
            !(Array.isArray(value) && value.length === 0) &&
            !(typeof value === 'object' &&
                !Array.isArray(value) &&
                Object.keys(value).length === 0)) {
            cleaned[key] = value;
        }
    });
    return cleaned;
};
exports.cleanQuery = cleanQuery;
