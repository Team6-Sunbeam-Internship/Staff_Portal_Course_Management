export const applyEntityPatch = ({ entity, payload, derive }) => {
	if (!entity || !payload) return;
	
	Object.assign(entity, payload);
	
	if(typeof derive === 'function') {
		derive(entity);
	}
}