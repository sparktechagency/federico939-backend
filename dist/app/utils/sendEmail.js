"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailToAdmin = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (to, html, subject) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: config_1.default.email.host,
        port: Number(config_1.default.email.port),
        secure: config_1.default.node_env === 'production',
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: config_1.default.email.user,
            pass: config_1.default.email.pass,
        },
    });
    yield transporter.sendMail({
        from: config_1.default.email.from,
        to,
        subject,
        text: '',
        html, // html body
    });
});
exports.sendEmail = sendEmail;
const sendEmailToAdmin = (data, html) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = data;
    const transporter = nodemailer_1.default.createTransport({
        host: config_1.default.email.host || 'smtp.gmail.com',
        port: Number(config_1.default.email.port) || 587,
        secure: config_1.default.node_env === 'production',
        auth: {
            user: config_1.default.email.user,
            pass: config_1.default.email.pass,
        },
    });
    yield transporter.sendMail({
        from: email,
        to: config_1.default.email.user,
        replyTo: email,
        subject: `Spetra Mentas: Problem reported by ${name}`,
        html,
    });
});
exports.sendEmailToAdmin = sendEmailToAdmin;
