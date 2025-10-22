export async function getAllReportsHandler(req, res, next) {
  try {
    const result = await getAllReports();

    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getStudentReportHandler(req, res, next) {
  try {
    const { id } = req.query;

    const result = await getStudentReport(id);

    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function newReportHandler(req, res, next) {
  try {
    const teacher = await getTeacherByUId(req.user.id);
    const student = await getStudentById(req.query.student_id);

    const report = await newReportSchema.parse(req.body);

    const result = await newReport(
      student.id,
      student.class_id,
      teacher.id,
      report.semester,
      report.academic_year,
      report.remarks,
      teacher.id
    );

    return res
      .status(200)
      .json({ messages: "new blank report added", data: result });
  } catch (error) {
    next(error);
  }
}

export async function addScoreHandler(req, res, next) {
  try {
    const { id: report_id } = req.params;
    const { subject_id, score } = req.body;

    const result = await addScore(report_id, subject_id, score);

    return res.status(200).json({ messages: "score", data: result });
  } catch (error) {
    next(error);
  }
}

export async function addScoreBulkHandler(req, res, next) {
  try {
    const { id } = req.params;

    const report = await getReportById(id);
    if (!report) {
      throw new NotFoundError(`report with ${id} not found`);
    }

    const scoreSchema = reportDetailSchema.parse(req.body);
    // console.log(report_id);
    // console.log(req.body);

    const value = [];
    const temp = [];

    scoreSchema.score.forEach((s, i) => {
      const index = i * 3;
      value.push(Number(report.id), s.subject_id, s.score);
      temp.push(`($${index + 1},${index + 2},${index + 3})`);
    });

    const result = await addScoreBulk(temp, value);

    return res.status(200).json({ messages: "score added", data: result });
  } catch (error) {
    next(error);
  }
}