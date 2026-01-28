// import { Button, Card, CardBody, ConfirmDialog, EmptyState, SkeletonTable, Table, TableHead, TableHeader, TableRow } from "../../../layout";
// import { Edit, List, Trash2 } from "lucide-react";

// const SubjectTable = ({
// 	isLoadingCourseHierarchy,
// 	fetchSubjects,
// 	handleOpenEditModal,
// 	creatingSubject,
// 	updatingSubject,
// 	deletingSubject,
// 	deleteModal,
// 	setDeleteModal,
// 	handleDeleteSubject,
// }) => {
// 	return (
// 		<>
// 			<Card className='h-[520px]'>
// 				<CardBody>
// 					{isLoadingCourseHierarchy ?
// 						<SkeletonTable />
// 					: fetchSubjects.length === 0 ?
// 						<EmptyState
// 							icon={<List className='h-12 w-12' />}
// 							title={`No Subjects found`}
// 							description='There are no subject in the system. Get started by adding a new one or importing from a file or select the module.'
// 						/>
// 					:	<>
// 							<Table>
// 								<TableHead>
// 									<TableRow>
// 										<TableHeader className='w-1/12 rounded-tl-2xl'>S.No</TableHeader>
// 										<TableHeader className='w-1/2'>Title</TableHeader>
// 										<TableHeader className='w-1/8'>Theory Hrs</TableHeader>
// 										<TableHeader className='w-1/8'>Practical Hrs</TableHeader>
// 										<TableHeader className='w-[120px] rounded-tr-lg text-center'>Actions</TableHeader>
// 									</TableRow>
// 								</TableHead>
// 							</Table>
// 							<div className='scrollbar-none overflow-y-auto rounded-b-2xl'>
// 								<Table>
// 									<TableBody>
// 										{fetchSubjects.map((subject, index) => (
// 											<TableRow key={subject.id}>
// 												<TableCell className='w-1/12 rounded-tl-2xl'>{index + 1}</TableCell>
// 												<TableCell className='w-1/2'>{subject.title}</TableCell>
// 												<TableCell className='w-1/8'>{subject.theoryHours}</TableCell>
// 												<TableCell className='w-1/8'>{subject.practicalHours}</TableCell>
// 												<TableCell className='w-[120px]'>
// 													<div className='flex items-center justify-center space-x-2'>
// 														<Button
// 															variant='ghost'
// 															className='cursor-pointer dark:hover:text-yellow-400'
// 															size='sm'
// 															onClick={handleOpenEditModal}
// 															disabled={creatingSubject || deletingSubject}>
// 															<Edit size={16} />
// 														</Button>
// 														<Button
// 															variant='ghost'
// 															size='sm'
// 															className='cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500'
// 															onClick={() =>
// 																setDeleteModal({
// 																	open: true,
// 																	subject,
// 																})
// 															}
// 															disabled={creatingSubject || updatingSubject}>
// 															<Trash2 size={16} />
// 														</Button>
// 													</div>
// 												</TableCell>
// 											</TableRow>
// 										))}
// 									</TableBody>
// 								</Table>
// 							</div>
// 						</>
// 					}
// 				</CardBody>
// 			</Card>

// 			{/* Confirmation Dialog */}
// 			<ConfirmDialog
// 				isOpen={deleteModal.open}
// 				onClose={() => setDeleteModal({ open: false, Subject: null })}
// 				onConfirm={() => handleDeleteSubject()}
// 				title='Delete Subject'
// 				message={`Are you sure you want to delete "${deleteModal.subject?.title}"? This action cannot be undone.`}
// 				confirmText='Delete'
// 				type='danger'
// 			/>
// 		</>
// 	);
// };

// export default SubjectTable;

import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit, Trash2, List } from "lucide-react";
import { useModal } from "../../../../providers";
import { Button, Card, CardBody, ConfirmDialog, EmptyState, SkeletonTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../layout";

const SubjectTable = ({
	isLoadingCourseHierarchy,
	fetchSubjects,
	selectedModuleId,
	selectedModuleTitle,
	creatingSubject,
	updatingSubject,
	deletingSubject,
	handleOpenEditModal,
	setDeleteModal,
	deleteModal,
	handleDeleteSubject,
}) => {
	const { openModal } = useModal();
console.log("selectedModuleTitle", selectedModuleTitle);
	// ----------------------------
	// No module selected
	// ----------------------------
	if (!selectedModuleId) {
		return (
			<Card className='h-[520px]'>
				<CardBody className='flex items-center justify-center'>
					<EmptyState
						icon={<List className='h-12 w-12' />}
						title='No Module Selected'
						description='Select module from the Module table to view subject list.'
					/>
				</CardBody>
			</Card>
		);
	}

	return (
		<>
			<Card className='h-[520px]'>
				<CardBody className='flex h-full flex-col'>
					{/* ---------- Header ---------- */}
					<div className='mb-3 flex items-center justify-end'>
						<Button
							icon={Plus}
							variant='gradientCyan'
							size='sm'
							onClick={() => openModal("Subject", "CREATE")}
							disabled={creatingSubject || updatingSubject}>
							Add Subject
						</Button>
					</div>

					{/* ---------- Animated Content ---------- */}
					<AnimatePresence mode='wait'>
						<motion.div
							key={selectedModuleId}
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -12 }}
							transition={{
								duration: 0.28,
								ease: [0.4, 0, 0.2, 1],
							}}
							className='flex-1'>
							{isLoadingCourseHierarchy ?
								<SkeletonTable />
							: fetchSubjects.length === 0 ?
								<EmptyState
									icon={<List className='h-12 w-12' />}
									title='No Subjects Found'
									description={`There are no subjects for module: ${selectedModuleTitle}. Start by adding one.`}
								/>
							:	<>
									<Table>
										<TableHead>
											<TableRow>
												<TableHeader className='w-[14%] rounded-tl-2xl'>S.No</TableHeader>
												<TableHeader className='w-[16%]'>Title</TableHeader>
												<TableHeader className='w-[16%]'>Theory Hours</TableHeader>
												<TableHeader className='w-[18%]'>Practical Hours</TableHeader>
												<TableHeader className='w-[16%] rounded-tr-2xl text-center'>Actions</TableHeader>
											</TableRow>
										</TableHead>
									</Table>

									<div className='h-[450px] scrollbar-none flex-1 overflow-y-auto'>
										<Table>
											<TableBody>
												{fetchSubjects.map((subject, index) => (
													<TableRow key={subject.id}>
														<TableCell className={`w-[14%] ${index === fetchSubjects?.length - 1 ? "rounded-bl-2xl" : ""}`}>{index + 1}</TableCell>
														<TableCell className='w-[16%]'>{subject.title || subject.subjectName}</TableCell>
														<TableCell className='w-[16%]'>{subject.theoryHours}</TableCell>
														<TableCell className='w-[18%]'>{subject.practicalHours}</TableCell>
														<TableCell className={`w-[16%] ${index === fetchSubjects?.length - 1 ? "rounded-br-2xl" : ""}`}>
															<div className='flex items-center justify-center gap-2'>
																<Button
																	variant='gradientAmber'
																	icon={Edit}
																	className='h-6 w-6 rounded-lg'
																	onClick={() => handleOpenEditModal(subject)}
																	disabled={updatingSubject || deletingSubject}></Button>
																<Button
																	variant='gradientRose'
																	icon={Trash2}
																	className='h-6 w-6 rounded-lg'
																	onClick={() =>
																		setDeleteModal({
																			open: true,
																			subject,
																		})
																	}
																	disabled={deletingSubject}></Button>
															</div>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</>
							}
						</motion.div>
					</AnimatePresence>
				</CardBody>
			</Card>
			{/* Confirmation Dialog */}
						<ConfirmDialog
							isOpen={deleteModal.open}
							onClose={() => setDeleteModal({ open: false, module: null })}
							onConfirm={() => handleDeleteSubject()}
							title='Delete Subject'
							message={`Are you sure you want to delete "${deleteModal.subject?.title}"? This action cannot be undone.`}
							confirmText='Delete'
							type='danger'
						/>
		</>
	);
};

export default SubjectTable;
