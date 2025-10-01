import { pool } from "../config/config.js";

////////// - GUARDIAN SECTION - //////////

export async function getAllGuardian () {
  try {
    const res = await pool.query(
      `
      select g.id as guardian_id, g.full_name, g.photo_profile,
      o.name
      from guardian g
      left join ocupation o on g.ocupation_id = o.id
      `
    )

    return res.rows
  } catch (error) {
    throw error
  }
}

export async function getGuardianID(id) {
  try {
    const res = await pool.query(
      `select id as guardian_id, user_id, full_name, address, phone_number from guardian where id = $1 and is_deleted = false`,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

// export async function getGuardianIdByUIDuser(user_id) {
//  try {
//   const res = await pool.query(
//     `select id, full_name from guardian
//     where user_id = $1 and is_deleted = false  
//     `,
//     [user_id]
//   )
//   return res.rows
//  } catch (error) {
//   throw error
//  } 
// }

export async function getGuardianName(full_name) {
  try {
    const res = await pool.query(
      `select full_name,relations,job,address,phone_number from guardian where full_name ILIKE $1`,
      [`%${full_name}%`]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

// export async function getStudentGuardian(guardian_id) {
//   try {
//     const res = await pool.query(`
//       select 
//       g.id as guardian_id, g.full_name as guardian_name, g.photo_profile as guardian_photo, g.relations as guardian_relations, g.address as guardian_address, g.phone_number as guardian_phone_number,
//       s.id as student_id, s.full_name as student_name, s.photo_profile as student_photo, s.gender as student_gender, s.address as student_address, s.birth_date as student_birthDate, s.nisn as student_nisn, s.class as student_class,
//       r.name as relationship
//       from guardian g
//       join student_guardian sg on g.id = sg.guardian_id
//       join students s on s.id = sg.students_id
//       join relationship r on r.id = sg.relationship_id
//       where g.id = $1
//       `,[guardian_id])
//       return res.rows
//   } catch (error) {
//     throw error
//   }
// }

export async function newGuardian(
  user_id,
  full_name,
  photo_profile,
  address,
  phone_number,
  emergency_number,
  occupation_id
) {
  try {
    
    const res = await pool.query(
      `insert into guardian (user_id, full_name, photo_profile, address, phone_number, emergency_number, occupation_id)
            values ($1,$2,$3,$4,$5,$6,$7) returning id`,
      [
        user_id,
        full_name,
        photo_profile,
        address,
        phone_number,
        emergency_number,
        occupation_id
      ]
    );

    await pool.query(
      `update users set is_profile_complete = true where id=$1`,
      [user_id]
    );
    
    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateGuardian(
  full_name,
  photo_profile,
  address,
  phone_number,
  emergency_number,
  occupation_id,
  user_id,
  relationship_id,
  id
) {
  try {
    const res = await pool.query(
      `update guardian set full_name=$1, photo_profile=$2, address=$3, phone_number=$4, emergency_number=$5, occupation_id=$6, updated_by=$7, updated_at=now() where id=$8 and is_deleted=false`,
      [full_name, photo_profile, address, phone_number, emergency_number, occupation_id, user_id, id]
    );

    await pool.query(
      `update student_guardian set relationship_id=$1 where guardian_id=$2`,[relationship_id, id]
    )

    return res.rowCount;
  } catch (error) {
    throw error;
  }
}

////////// - STUDENT SECTION - //////////

export async function getAllStudent() {
  try {
    const res = await pool.query(`
      select 
      s.class_id, s.full_name, s.photo_profile, s.gender, s.birth_date, s.nisn,
      c.class_name, c.grade_level, c.description
      from students s
      left join classes c on s.class_id = c.id
      `)

      return res.rows
  } catch (error) {
    throw error
  }
}

export async function getStudentById(id) {
  try {
    const res = await pool.query(`
      select 
      s.id, s.class_id, s.full_name, s.photo_profile , s.gender, s.birth_date, s.nisn,
      c.class_name, c.grade_level, c.description
      from students s
      join classes c on s.class_id = c.id
      where s.id = $1 and s.is_deleted is false
      `,[id])

      return res.rows[0]
  } catch (error) {
    throw(error)
  }
}

export async function getStudentProfile(id) {
  try {
    const res = await pool.query(
      `
      select 
      s.id, s.full_name, s.photo_profile, s.gender, s.address, s.birth_date, s.nisn,
      c.class_name, c.grade_level, c.description
      from students s
      left join classes c on s.class_id = c.id
      where s.id=$1 and s.is_deleted = false`,
      [id]
    );
    return res.rows[0]
  } catch (error) {
    throw error;
  }
}

export async function getStudentName(full_name) {
  try {
    const res = await pool.query(
      `select 
      s.id, s.guardian_id, s.full_name, s.photo_profile, s.gender, s.address, s.birth_date, s.nisn,
      c.class_name, c.grade_level, c.description
      from students s
      left join classes c on s.class_id = c.id
      where s.full_name ILIKE $1 and s.is_deleted = false`,
      [`%${full_name}%`]
    );
    return res.rows;
  } catch (error) {
    throw error;
  }
}

export async function newStudent(
  guardian_id,
  class_id,
  full_name,
  photo_profile,
  gender,
  address,
  birth_date,
  nisn,
  created_by
) {
  try {
    // const role_id = 4;
    const res = await pool.query(
      `
      insert into students (guardian_id, class_id, full_name, photo_profile, gender, address, birth_date, nisn, created_by)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id
      `,
      [
        guardian_id,
        class_id,
        full_name,
        photo_profile,
        gender,
        address,
        birth_date,
        nisn,
        created_by
      ]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function newStudentGuardian(
  guardian_id,
  student_id,
  relationship_id
) {
  try {
    const res = await pool.query(
      `
      insert into student_guardian (guardian_id, students_id, relationship_id) 
      values ($1,$2,$3) returning *
      `,
      [guardian_id, student_id, relationship_id]
    );
    return res.rows[0]
  } catch (error) {
    throw error;
  }
}

export async function updateStudent(
  id,
  class_id,
  full_name,
  photo_profile,
  address,
  nisn,
  updated_by
) {
  try {
    const res = await pool.query(
      `update students 
      set class_id=$1, full_name=$2, photo_profile=$3, address=$4, nisn=$5, updated_by=$6, updated_at=now() where id=$7 and is_deleted=false returning id`,
      [class_id, full_name, photo_profile, address, nisn, updated_by, id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}


export async function getStudentGuardianData (student_id, guardian_id) {
  try {
    const res = await pool.query(
      `
      select * from student_guardian where students_id = $1 and guardian_id = $2
      `,[student_id, guardian_id]
    )

    return res
  } catch (error) {
    throw error
  }
}
