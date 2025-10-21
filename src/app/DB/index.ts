import { USER_ROLE } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';

const student = {
  name: 'student',
  email: 'student@gmail.com',
  password: 12345,
  needsPasswordChange: false,
  role: USER_ROLE.student,
  status: 'in-progress',
  isDeleted: false,
};
const teacher = {
  name: 'teacher',
  email: 'teacher@gmail.com',
  password: 12345,
  needsPasswordChange: false,
  role: USER_ROLE.teacher,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperUser = async () => {

  const isStudentExist = await User.findOne({ role: USER_ROLE.student });
  
  if (!isStudentExist) {
    await User.create(student);
  }

  const isTeacherExist = await User.findOne({ role: USER_ROLE.teacher });

  if (!isTeacherExist) {
    await User.create(teacher);
  }
};

export default seedSuperUser;
