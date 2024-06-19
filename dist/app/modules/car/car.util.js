"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMinutes = void 0;
const convertMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};
exports.convertMinutes = convertMinutes;
