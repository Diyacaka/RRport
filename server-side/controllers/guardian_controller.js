import {
  guardianRegisterSchema,
  guardianUpdateSchema,
} from "../helpers/zod.js";
import {
  getGuardian,
  getGuardianID,
  newGuardian,
  softDeleteGuardian,
  updateGuardian,
} from "../models/guardian_model.js";

export async function getGuardianIDHandler(req, res, next) {
  try {
    const { id } = req.params;
    console.log(id);

    const result = await getGuardianID(id);

    if (!result) {
      return res
        .status(404)
        .json({ messages: `id from guardian does not exist` });
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    throw error;
  }
}

export async function getGuardianHandler(req, res, next) {
  try {
    const { full_name } = req.body;
    const result = await getGuardian(full_name);

    if (!result) {
      return res.status(404).json({ messages: `Cannot find Guardian` });
    }

    return res.status(201).json({ data: result });
  } catch (error) {
    throw error;
  }
}

export async function newGuardianHandler(req, res, next) {
  try {
    const { id: user_id, role: role_id } = req.user;
    const {
      full_name,
      photo_profile,
      relations,
      job,
      address,
      phone_number,
      emergency_number,
    } = guardianRegisterSchema.parse(req.body);
    const result = await newGuardian(
      user_id,
      full_name,
      photo_profile,
      role_id,
      relations,
      job,
      address,
      phone_number,
      emergency_number
    );

    return res.status(200).json({ messages: "regiter success", data: result });
  } catch (error) {
    throw error;
  }
}

export async function updateGuardianHandler(req, res, next) {
  try {
    const { id } = req.params;
    const guardian = await getGuardianID(id);

    console.log(guardian);
     

    if (!guardian) {
      return res
        .status(404)
        .json({ messages: "id from guardian does not exist" });
    }

    const data = guardianUpdateSchema.parse(req.body);
    const result = await updateGuardian(
      data.full_name,
      data.relations,
      data.job,
      data.address,
      data.phone_number,
      data.emergency_number??'-',
      id
    );

    return res.status(200).json({ messages: `update succes`, data: result });
  } catch (error) {
    throw error;
  }
}

export async function softDeleteGuardianHandler(req, res, next) {
  try {
    const {id} = req.params
    const guardian = await getGuardian(id)
    console.log(guardian);
    
    if (!guardian) {
      res.status(404).json({messages:'Guardian Does Not exist'})
    }

    const result = await softDeleteGuardian(id)
    res.status(200).json({messages:'Delete Succes'})
  } catch (error) {
    throw error
  }
}