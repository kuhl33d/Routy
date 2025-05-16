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

    const baseQuery =
      req.user.role === "admin"
        ? Student.find()
        : Student.find({ schoolId: school._id });

    const query = baseQuery
      .populate({
        path: "userId",
        select: "name age grade",
      })
      .populate({
        path: "parentId",
        populate: {
          path: "userId",
          select: "name email phoneNumber",
          model: "User",
        },
      })
      .populate({
        path: "routeId",
        select: "name",
        model: "Route", // Make sure to specify the model name
      })
      .populate("schoolId pickupLocation");

    const result = await paginateQuery(page, limit, query);

    // Transform the response
    const transformedData = result.data.map((student) => ({
      _id: student._id,
      user: {
        name: student.userId?.name,
        age: student.age,
        grade: student.grade,
      },
      parents:
        student.parentId?.map((parent) => ({
          _id: parent._id,
          name: parent.userId?.name,
          email: parent.userId?.email,
          phoneNumber: parent.userId?.phoneNumber || [],
        })) || [],
      route: student.routeId
        ? {
            _id: student.routeId._id,
            name: student.routeId.name,
          }
        : null,
      schoolId: student.schoolId,
      status: student.status,
      enrolled: student.enrolled,
      fees: student.fees,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      data: transformedData,
      total: result.total,
      limit: result.limit,
      page: result.page,
      pages: result.pages,
    });
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
    try {
      const { name, parentEmail, age, grade, schoolId } = req.body;

      // Find the parent in the Users collection
      const parent = await User.findOne({ email: parentEmail, role: "parent" });

      if (!parent) {
        console.log("Parent not found for email:", parentEmail); // Debugging log
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: [
            {
              type: "field",
              msg: "Parent not found",
              path: "parentEmail",
              location: "body",
            },
          ],
        });
      }
      console.log("Parent Found:", parent); // Debugging log

      // Retrieve userId from the found parent
      const parentUserId = parent._id;

      // Find the parent record in the Parents collection using userId
      const parentRecord = await Parent.findOne({ userId: parentUserId });

      if (!parentRecord) {
        console.log("Parent record not found for userId:", parentUserId); // Debugging log
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: [
            {
              type: "field",
              msg: "Parent record not found",
              path: "parentEmail",
              location: "body",
            },
          ],
        });
      }
      console.log("Parent Record Found:", parentRecord); // Debugging log

      // Extract parentId from parentRecord
      const parentId = parentRecord._id;
      console.log("Valid Parent ID:", parentId); // Debugging log

      // Ensure parentId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        console.log("Invalid Parent ID:", parentId); // Debugging log
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: [
            {
              type: "field",
              msg: "Invalid parent ID",
              path: "parentId",
              location: "body",
            },
          ],
        });
      }

      // Create a new user for the student
      const studentUser = new User({ name, role: "student" });
      await studentUser.save();

      // Create and save the student record
      const student = new Student({
        userId: studentUser._id,
        age,
        grade,
        parentId,
        schoolId,
      });

      await student.save();

      // Update parent's children array
      parentRecord.children.push(student._id);
      await parentRecord.save();

      res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: student,
      });
    } catch (error) {
      console.error("Server error:", error); // Debugging log
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
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
