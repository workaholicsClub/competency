SELECT pm.*, COUNT(*) AS coursesCount FROM professions pm
	LEFT JOIN (
		SELECT 
			*,
			SUM(isProfession) AS profSkills,
			COUNT(*)-SUM(isProfession) AS nonProfSkills,
			SUM(isProfession) > COUNT(*)-SUM(isProfession) AS hasMoreProfSkills,
			SUM(isProfession)/COUNT(*) AS profSkillsRate
		FROM (
			SELECT pall.id AS professionId, c.id AS courseId, c.*, MAX(p.`code` = pall.`code`) AS isProfession FROM courses c
					LEFT JOIN links_skills_courses lsc ON c.id = lsc.courseId
					LEFT JOIN links_skills_professions lsp ON lsc.skillId = lsp.skillId
					LEFT JOIN professions p ON lsp.professionId = p.id
					CROSS JOIN professions pall
			WHERE c.inArchive = 0
			GROUP BY pall.id, c.id, lsc.skillId
		) sq
		GROUP BY professionId, courseId
		HAVING profSkillsRate >= 0.6
	) pc ON pc.professionId = pm.id
GROUP BY pm.id