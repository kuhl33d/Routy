import School from "../models/school.model.js";

export const getSchoolIdbyUserId = async (userId) => {
  console.log("getSchoolIdbyUserId - userId", userId);
  const school = await School.findOne({ userId });
  if (!school) return null;
  console.log("getSchoolIdbyUserId - schoolId", school._id);
  return school._id;
};
