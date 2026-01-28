export const deriveCourseFields = (premises = [], batchCycles = [], courseTypes = []) => {
	return (entity) => {
	console.log("deriveCourseFields called with entity:", entity);
    if (!entity) return;

    const premise = premises.find(p => p.id === entity.premiseId);
    if (premise) {
		entity.premiseName = premise.title;
    }

    const batchCycle = batchCycles.find(b => b.id === entity.batchCycleId);
    if (batchCycle) {
		entity.batchCycleName = batchCycle.title;
    }

    const courseType = courseTypes.find(c => c.id === entity.courseTypeId);
    if (courseType) {
		entity.courseTypeName = courseType.title;
    }
	};
};
