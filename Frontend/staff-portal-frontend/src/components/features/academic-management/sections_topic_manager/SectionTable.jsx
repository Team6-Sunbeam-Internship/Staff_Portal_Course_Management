import React from "react";
import { useModal } from "../../../../providers";

export const SectionTable = ({
	isLoadingCourseHierarchy,
	courseHierarchy,
	filters,
	handleOpenEditModal,
	deleteModal,
	setDeleteModal,
	creating,
	updating,
	deleting,
	setSelectedSectionId,
	editingSection,
	setEditingSection,
	handleCreateSection,
	handleUpdateSection,
	handleDeleteSection,
}) => {
	const { showModal, setShowModal } = useModal();
	return (
		<>
			<Card className='h-[520px]'>
				<CardBody>
					{isLoadingCourseHierarchy ? (
						<SkeletonTable />
					) : courseHierarchy.length === 0 ? (
						<EmptyState
							icon={<List className='w-12 h-12' />}
							title={`No Sections found`}
							description='Please select the batch cycle, course, module, and subject to view the sections.'
						/>
					) : (
						<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-1/12 rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-1/3'>Title</TableHeader>
										<TableHeader className='text-center rounded-tr-lg w-[120px]'>Actions</TableHeader>
										<TableHeader className='text-center rounded-tr-lg w-[120px]'>View Topics</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='rounded-b-2xl overflow-y-auto scrollbar-none'>
								<Table>
									<TableBody>
										{courseHierarchy.sections.map((section, index) => (
											<TableRow key={section.id}>
												<TableCell className='w-1/12 rounded-tl-2xl'>{index + 1}</TableCell>
												<TableCell className='w-1/3'>{section.title}</TableCell>
												<TableCell className='w-[120px]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='ghost'
															className='cursor-pointer dark:hover:text-yellow-400'
															size='sm'
															onClick={() => handleOpenEditModal(section)}
															disabled={creating || deleting}>
															<Edit size={16} />
														</Button>
														<Button
															variant='ghost'
															size='sm'
															className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer'
															onClick={() =>
																setDeleteModal({
																	open: true,
																	section,
																})
															}
															disabled={creating || updating}>
															<Trash2 size={16} />
														</Button>
													</div>
												</TableCell>
												<TableCell
													className='w-[120px] cursor-pointer'
													onClick={() => setSelectedSectionId(section.sectionCode)}>
													[view topics]
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</>
					)}
				</CardBody>
			</Card>
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setEditingSection(null);
				}}
				size='lg'>
				<ModalHeader
					title={editingSection ? "Edit Section" : "Create New Section"}
					subtitle={editingSection ? "Update Section details." : "Add a new section to the course."}
					onClose={() => {
						setShowModal(false);
						setEditingSection(null);
					}}
				/>
				<ModalBody>
					<SectionForm
						section={editingSection}
						batchCycleId={filters.batchCycleId}
						courseCode={filters.courseCode}
						moduleCode={filters.moduleCode}
						subjectCode={filters.subjectCode}
						onSubmit={editingSection ? handleUpdateSection : handleCreateSection}
						onCancel={() => {
							setShowModal(false);
							setEditingSection(null);
						}}
						isLoading={creating || updating}
					/>
				</ModalBody>
			</Modal>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, section: null })}
				onConfirm={() => handleDeleteSection()}
				title='Delete Section'
				message={`Are you sure you want to delete "${deleteModal.section?.title}"? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};
