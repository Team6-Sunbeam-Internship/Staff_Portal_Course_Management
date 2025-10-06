import React from "react";
import { useModal } from "../../../../providers";

export const TopicTable = ({
	isLoadingCourseHierarchy,
	fetchTopics,
	handleOpenEditModal,
	deleteModal,
	setDeleteModal,
	creating,
	updating,
	deleting,
	editingTopic,
	setEditingTopic,
	handleCreateTopic,
	handleUpdateTopic,
	handleDeleteTopic,
}) => {
	const { showModal, setShowModal } = useModal();
	return (
		<>
			<Card className='h-[520px]'>
				<CardBody>
					{isLoadingCourseHierarchy ? (
						<SkeletonTable />
					) : fetchTopics.length === 0 ? (
						<EmptyState
							icon={<List className='w-12 h-12' />}
							title={`No Topics found`}
							description='There are no topics found in the system for the selected section. Get started by adding a new one or importing from a file or select the module.'
						/>
					) : (
						<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-1/12 rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-1/2'>Title</TableHeader>
										<TableHeader className='text-center rounded-tr-lg w-[120px]'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='rounded-b-2xl overflow-y-auto scrollbar-none'>
								<Table>
									<TableBody>
										{fetchTopics.map((topic, index) => (
											<TableRow key={topic.id}>
												<TableCell className='w-1/12 rounded-tl-2xl'>{index + 1}</TableCell>
												<TableCell className='w-1/2'>{topic.topicName}</TableCell>
												<TableCell className='w-[120px]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='ghost'
															className='cursor-pointer dark:hover:text-yellow-400'
															size='sm'
															onClick={() => handleOpenEditModal(topic)}
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
																	topic,
																})
															}
															disabled={creating || updating}>
															<Trash2 size={16} />
														</Button>
													</div>
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
					setEditingTopic(null);
				}}
				size='lg'>
				<ModalHeader
					title={editingTopic ? "Edit Subject" : "Create New Subject"}
					subtitle={editingTopic ? "Update topic details." : "Add a new topic to the module."}
					onClose={() => {
						setShowModal(false);
						setEditingTopic(null);
					}}
				/>
				<ModalBody>
					<SubjectForm
						topic={editingTopic}
						onSubmit={editingTopic ? handleUpdateTopic : handleCreateTopic}
						onCancel={() => {
							setShowModal(false);
							setEditingTopic(null);
						}}
						isLoading={creating || updating}
					/>
				</ModalBody>
			</Modal>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, Subject: null })}
				onConfirm={() => handleDeleteTopic()}
				title='Delete Subject'
				message={`Are you sure you want to delete "${deleteModal.topic?.title}"? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};