import colors from "colors";
import { USER_ROLE } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';
import { logger } from '../shared/logger';

const superUser = {
  name: "Super Admin",
  role: USER_ROLE.admin,
  email: "admin@gmail.com",
  password: "admin123",
  phone: "017XXXXXXXX", // Required
  countryCode: "BD",
  dateOfBirth: "1990-01-01",
  verified: true,
};



const seedSuperAdmin = async () => {
  const isExistSuperAdmin = await User.findOne({
    role: USER_ROLE.admin,
  });

  if (!isExistSuperAdmin) {
    await User.create(superUser);
   logger.info(colors.green("✔ Super admin created successfully!"));
  }
};

export default seedSuperAdmin;
