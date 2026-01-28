export const deriveInfrastructureFields = (premises = []) => {
	return (entity) => {
		if (!entity?.premiseId) return;
		const premise = premises.find((premise) => premise.id === entity.premiseId);
		if (!premise) return;

		entity.premisesTitle = premise?.title ?? "";
	};
};
