export const CardBody = ({ children, className = "" }) => (
	<div className={` ${className}`}>{children}</div>
);
// removed h-full
// const CardBody = ({ children, className = "" }) => (
// 	<div className={`p-4 ${className}`}>{children}</div>
// );