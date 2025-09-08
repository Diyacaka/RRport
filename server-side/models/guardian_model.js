import { pool } from "../config/config.js";

////////// - GUARDIAN SECTION - //////////

export async function getGuardianID(user_id) {
  try {
    const res = await pool.query(
      `select id as guardian_id, full_name, relations, job, address, phone_number from guardian where user_id = $1 and is_deleted = false`,
      [user_id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getGuardianIdByUIDuser(user_id) {
 try {
  const res = await pool.query(
    `select id as guardian_id, full_name, phone_number from guardian
    where user_id = $1 and is_deleted = false  
    `,
    [user_id]
  )
  return res.rows
 } catch (error) {
  throw error
 } 
}

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

export async function getStudentGuardian(guardian_id) {
  try {
    const res = await pool.query(`
      select 
      g.id as guardian_id, g.full_name as guardian_name, g.photo_profile as guardian_photo, g.relations as guardian_relations, g.address as guardian_address, g.phone_number as guardian_phone_number,
      s.id as student_id, s.full_name as student_name, s.photo_profile as student_photo, s.gender as student_gender, s.address as student_address, s.birth_date as student_birthDate, s.nisn as student_nisn, s.class as student_class,
      r.name as relationship
      from guardian g
      join student_guardian sg on g.id = sg.guardian_id
      join students s on s.id = sg.students_id
      join relationship r on r.id = sg.relationship_id
      where g.id = $1
      `,[guardian_id])
      return res.rows
  } catch (error) {
    throw error
  }
}

export async function newGuardian(
  user_id,
  full_name,
  photo_profile,
  role_id,
  relations,
  job,
  address,
  phone_number,
  emergency_number
) {
  try {
    // const {id, role} = req.user
    const res = await pool.query(
      `insert into guardian (user_id, full_name,photo_profile, role, relations, job, address, phone_number, emergency_number)
            values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`,
      [
        user_id,
        full_name,
        photo_profile,
        role_id,
        relations,
        job,
        address,
        phone_number,
        emergency_number,
      ]
    );

    await pool.query(
      `update users set is_profile_complete = true where id=$1`,
      [user_id]
    );
    // await pool.query("commit");
    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateGuardian(
  full_name,
  relations,
  job,
  address,
  phone_number,
  emergency_number,
  id
) {
  try {
    const res = await pool.query(
      `update guardian set full_name = $1, relations = $2, job=$3, address=$4, phone_number=$5, emergency_number=$6, updated_at=now() where id = $7 and is_deleted=false`,
      [full_name, relations, job, address, phone_number, emergency_number, id]
    );

    return res.rowCount;
  } catch (error) {
    throw error;
  }
}

export async function guardianDashboard(id) {
  try {
    const res = await pool.query(`
      select 
      `);
  } catch (error) {}
}

////////// - STUDENT SECTION - //////////

export async function getStudentProfile(id, guardian_id) {
  try {
    const res = await pool.query(
      `
      select 
      s.full_name as full_name, s.photo_profile as photo_profile, s.nisn as nisn, s.class as class, s.birth_date as birth_date from students s
      join student_guardian sg on sg.students_id = s.id
      where s.id = $1 and sg.guardian_id = $2 and s.is_deleted = false`,
      [id, guardian_id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getStudentName(full_name) {
  try {
    const res = await pool.query(
      `select s.id, s.full_name, s.photo_profile, s.address, s.birth_date, s.nisn, s.class, sg.guardian_id from students s
      left join student_guardian sg on s.id = sg.student_id
      where s.full_name ILIKE $1 and s.is_deleted = false`,
      [`%${full_name}%`]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function newStudent(
  guardian_id,
  full_name,
  photo_profile,
  gender,
  address,
  birth_date,
  nisn,
  classes
) {
  try {
    const role_id = 4;
    const res = await pool.query(
      `
      insert into students (guardian_id, full_name, role, photo_profile, gender, address, birth_date, nisn, class)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id
      `,
      [
        guardian_id,
        full_name,
        role_id,
        photo_profile,
        gender,
        address,
        birth_date,
        nisn,
        classes,
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
  full_name,
  photo_profile,
  address,
  nisn,
  classes
) {
  try {
    const res = await pool.query(
      `update students set full_name=$1, photo_profile=$2, address=$3, nisn=$4, class=$5, updated_at=now() where id=$6 and is_deleted=false  returning id`,
      [full_name, photo_profile, address, nisn, classes, id]
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
