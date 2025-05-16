import Student from "../models/student.model.js";
import School from "../models/school.model.js";
import User from "../models/user.model.js";
import { paginateQuery } from "../helpers/pagination.js";
import { controllerWrapper } from "../utils/wrappers.js";

// Get all students
export const getAllStudents = controllerWrapper(
  "getAllStudents",
  async (req, res) => {
    const { page, limit } = req.body;
    let school;

    if (req.user.role === "school") {
      school = await School.findOne({ userId: req.user._id });
      if (!school) {
        return res
          .status(404)
          .json({ success: false, message: "School not found" });
      }
    }
    const query =
      req.user.role === "admin"
        ? Student.find()
            .populate("userId", "name email")
            .populate("parentId schoolId pickupLocation")
        : Student.find({ schoolId: school._id });

    const students = await paginateQuery(page, limit, query);
    return res.status(students.success ? 200 : 400).json(students);
  }
);

// Get a single student by ID
export const getStudentById = controllerWrapper(
  "getStudentById",
  async (req, res) => {
    const student = await Student.findById(req.params.studentId).populate(
      "userId",
      "name email"
    );
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, student });
  }
);

// Get students by parent ID
export const getStudentsByParentId = controllerWrapper(
  "getStudentsByParentId",
  async (req, res) => {
    const { parentId } = req.params;

    const students = await Student.find(
      req.user.role === "school"
        ? { parentId, schoolId: req.user._id }
        : { parentId }
    );

    return res.status(200).json({ success: true, data: students });
  }
);
// Get students by school ID (Secure version)
export const getStudentsBySchoolId = controllerWrapper(
  "getStudentsBySchoolId",
  async (req, res) => {
    const { schoolId } = req.params;

    // If the user is a school, they can ONLY access their own students
    if (req.user.role === "school" && req.user._id.toString() !== schoolId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Populate students instead of querying directly
    const school = await Student.findById(schoolId).populate("students");

    if (!school) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }

    if (!school.students.length) {
      return res
        .status(404)
        .json({ success: false, message: "No students found for this school" });
    }

    return res.status(200).json({ success: true, data: school.students });
  }
);

// Create a new student
export const createStudent = controllerWrapper(
  "createStudent",
  async (req, res) => {
    const {
      name,
      email,
      password,
      phoneNumber,
      addresses,
      age,
      grade,
      parentId,
      schoolId,
      routeId,
      pickupLocation,
      enrolled,
      fees,
    } = req.body;

    const user = new User({
      name,
      email,
      password,
      addresses,
      phoneNumber,
      role: "student",
    });
    await user.save();

    const student = new Student({
      userId: user._id,
      age,
      grade,
      parentId,
      schoolId,
      routeId,
      pickupLocation,
      enrolled,
      fees,
    });
    await student.save();

    res
      .status(201)
      .json({ success: true, message: "Student created", data: student });
  }
);

export const updateStudent = controllerWrapper(
  "updateStudent",
  async (req, res) => {
    const { studentId } = req.params;
    const {
      name,
      email,
      password,
      phone,
      addresses,
      age,
      grade,
      parentId,
      schoolId,
      routeId,
      pickupLocation,
      enrolled,
      fees,
    } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update the user information
    const user = await User.findById(student.userId);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;
      user.phone = phone || user.phone;
      user.addresses = addresses || user.addresses;
      await user.save();
    }

    // Update the student information
    student.age = age || student.age;
    student.grade = grade || student.grade;
    student.parentId = parentId || student.parentId;
    student.schoolId = schoolId || student.schoolId;
    student.routeId = routeId || student.routeId;
    student.pickupLocation = pickupLocation || student.pickupLocation;
    student.enrolled = enrolled || student.enrolled;
    student.fees = fees || student.fees;
    await student.save();

    return res
      .status(200)
      .json({ success: true, message: "Student updated", data: student });
  }
);

// Soft delete a student by ID
export const safeDeleteStudent = controllerWrapper(
  "safeDeleteStudent",
  async (req, res) => {
    const { studentId } = req.params;
    const deletedStudent = await Student.findByIdAndUpdate(studentId, {
      deleted: true,
    });
    if (!deletedStudent)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, message: "Student deleted" });
  }
);

// Permanently delete a student by ID
export const finalDeleteStudent = controllerWrapper(
  "finalDeleteStudent",
  async (req, res) => {
    const { studentId } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if (!deletedStudent)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, message: "Student deleted" });
  }
);
