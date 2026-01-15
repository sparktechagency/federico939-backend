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
exports.UserService = void 0;
const user_model_1 = require("./user.model");
const http_status_codes_1 = require("http-status-codes");
const user_constant_1 = require("./user.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const generateOTP_1 = __importDefault(require("../../utils/generateOTP"));
const emailTemplate_1 = require("../../shared/emailTemplate");
const emailHelper_1 = require("../../helpers/emailHelper");
const jwtHelper_1 = require("../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../config"));
const unlinkFile_1 = __importDefault(require("../../shared/unlinkFile"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createAdminToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check admin is exist or not;
    const isExistAdmin = yield user_model_1.User.findOne({ email: payload.email });
    if (isExistAdmin) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'This Email already taken');
    }
    // create admin to db
    const createAdmin = yield user_model_1.User.create(payload);
    if (!createAdmin) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create Admin');
    }
    else {
        yield user_model_1.User.findByIdAndUpdate({ _id: createAdmin === null || createAdmin === void 0 ? void 0 : createAdmin._id }, { verified: true }, { new: true });
    }
    return createAdmin;
});
const createUserToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createUser = yield user_model_1.User.create(payload);
    if (!createUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create user');
    }
    //send email
    const otp = (0, generateOTP_1.default)();
    const values = {
        name: createUser.name,
        otp: otp,
        email: createUser.email,
    };
    const createAccountTemplate = emailTemplate_1.emailTemplate.createAccount(values);
    emailHelper_1.emailHelper.sendEmail(createAccountTemplate);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };
    yield user_model_1.User.findOneAndUpdate({ _id: createUser._id }, { $set: { authentication } });
    const createToken = jwtHelper_1.jwtHelper.createToken({
        id: createUser._id,
        email: createUser.email,
        role: createUser.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
    const result = {
        token: createToken,
        user: createUser,
    };
    return result;
});
const getUserProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
});
const updateProfileToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //unlink file here
    if (payload.profileImage && isExistUser.profileImage) {
        (0, unlinkFile_1.default)(isExistUser.profileImage);
    }
    const updateDoc = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return updateDoc;
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let baseQuery;
    // 🔥 If ?role=admin → exclude USER and SUPER_ADMIN
    if (query.role === 'ADMIN') {
        baseQuery = user_model_1.User.find({
            $and: [{ role: { $ne: 'USER' } }, { role: { $ne: 'SUPER_ADMIN' } }],
        });
        // remove role from query so QueryBuilder.filter() does NOT override it
        delete query.role;
    }
    else {
        baseQuery = user_model_1.User.find();
    }
    const queryBuilder = new QueryBuilder_1.default(baseQuery, query)
        .search(['name', 'email'])
        .sort()
        .fields()
        .filter()
        .paginate();
    const users = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    if (!users || users.length === 0) {
        throw new AppError_1.default(404, 'No users are found in the database');
    }
    return {
        data: users,
        meta,
    };
});
const getUserByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    if (!result) {
        throw new AppError_1.default(404, 'No user is found ');
    }
    return result;
});
const updateUserStatusByIdToDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    if (![user_constant_1.STATUS.ACTIVE, user_constant_1.STATUS.INACTIVE].includes(status)) {
        throw new AppError_1.default(400, "Status must be either 'ACTIVE' or 'INACTIVE'");
    }
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(404, 'No user is found by this user ID');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { status }, { new: true });
    if (!result) {
        throw new AppError_1.default(400, 'Failed to change status by this user ID');
    }
    return result;
});
const deleteUserByIdFromD = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(404, 'User doest not exist in the database');
    }
    const result = yield user_model_1.User.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(400, 'Failed to delete user by this ID');
    }
    return result;
});
const deleteProfileFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    const result = yield user_model_1.User.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(400, 'Failed to delete this user');
    }
    return result;
});
exports.UserService = {
    createUserToDB,
    getUserProfileFromDB,
    updateProfileToDB,
    createAdminToDB,
    getAllUsersFromDB,
    getUserByIdFromDB,
    updateUserStatusByIdToDB,
    deleteUserByIdFromD,
    deleteProfileFromDB,
};
