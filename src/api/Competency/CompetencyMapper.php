<?php

namespace Competencies\Competency;

use Spot\Mapper;

class CompetencyMapper extends Mapper
{
    public function getCompetencyStats() {
        $statSql = "SELECT 
                competencyId,
                atomicSkillId,
                STD(numericLevel) AS `std`,
                STD(numericLevel)/SQRT(COUNT(*)) AS `sem`,
                AVG(numericLevel) AS `avg`,
                COUNT(*) AS `cnt`
            FROM 
            (
                SELECT c.id AS competencyId, a.id AS atomicSkillId, ss.sessionId, IFNULL(ss.numericLevel, 0) AS numericLevel FROM competencies c
                    LEFT JOIN atomicSkills a ON c.id = a.competencyId
                    LEFT JOIN (
                        SELECT
                            *,
                            CASE ss.level WHEN 'none' THEN 0 WHEN 'knowledge' THEN 1 WHEN 'skill' THEN 2 WHEN 'ability' THEN 3 ELSE 0 END AS numericLevel
                        FROM sessionsSkills ss
                    ) ss ON a.id = ss.atomicSkillId
            ) stat
            GROUP BY competencyId, atomicSkillId";

        /**
         * @var CompetencyEntity[] $statEntities
         */
        $statEntities = $this->query($statSql);
        $groupedStats = [];
        foreach ($statEntities as $statEntity) {
            $stdRange = 1.96;
            $skillSem = $statEntity->get('sem');
            $skillAvg = $statEntity->get('avg');
            $lowerBound = $skillAvg - $stdRange * $skillSem;
            $upperBound = $skillAvg + $stdRange * $skillSem;

            $skillStat = [
                'std'   => $statEntity->get('std'),
                'sem'   => $skillSem,
                'avg'   => $skillAvg,
                'lower' => $lowerBound,
                'upper' => $upperBound,
            ];

            $competencyId = $statEntity->get('competencyId');
            $groupedStats[ $competencyId ] = $groupedStats[ $competencyId ] ?? [
                    'lowerSum'   => 0,
                    'avgSum'     => 0,
                    'upperSum'   => 0,
                    'skillCount' => 0,
                ];
            $groupedStats[ $competencyId ]['lowerSum'] += $skillStat['lower'];
            $groupedStats[ $competencyId ]['avgSum'] += $skillStat['avg'];
            $groupedStats[ $competencyId ]['upperSum'] += $skillStat['upper'];
            $groupedStats[ $competencyId ]['skillCount']++;
        }

        $competencyStats = [];
        foreach ($groupedStats as $competencyId => $groupedStat) {
            $competencyStats[ $competencyId ] = [
                'lower'   => round($groupedStat['lowerSum'] / $groupedStat['skillCount'], 2),
                'upper'   => round($groupedStat['upperSum'] / $groupedStat['skillCount'], 2),
                'average' => round($groupedStat['avgSum'] / $groupedStat['skillCount'], 2),
            ];
        }

        return $competencyStats;
    }
}