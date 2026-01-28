import { motion, AnimatePresence } from "motion/react";
import { useModal } from "../../../../providers";
import {
	Button,
	Card,
	CardBody,
	ConfirmDialog,
	EmptyState,
	Modal,
	ModalBody,
	ModalHeader,
	SkeletonTable,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../layout";
import { Edit, List, Plus, Trash2 } from "lucide-react";
import { SubjectForm } from "../module_subject_manager";

export const TopicTable = ({
	isLoadingCourseHierarchy,
	fetchTopics,
	selectedSectionId,
	selectedSectionTitle,
	creating,
	updating,
	deleting,
	handleOpenEditModal,
	setDeleteModal,
	deleteModal,
	handleDeleteTopic,
}) => {
	const { openModal } = useModal();

	// ----------------------------
	// No module selected
	// ----------------------------
	if (!selectedSectionId) {
		return (
			<Card className='h-[520px]'>
				<CardBody className='flex items-center justify-center'>
					<EmptyState
						icon={<List className='h-12 w-12' />}
						title='No Section Selected'
						description='Select section from the Section table to view topic list.'
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
						<Button icon={Plus} variant='gradientCyan' size='sm' onClick={() => openModal("Topic", "CREATE")} disabled={creating || updating}>
							Add Topic
						</Button>
					</div>
					<AnimatePresence mode='wait'>
						<motion.div
							key={selectedSectionId}
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
							: fetchTopics.length === 0 ?
								<EmptyState
									icon={<List className='h-12 w-12' />}
									title={`No Topics found`}
									description={`There are no topics for section: ${selectedSectionTitle}. Start by adding one.`}
								/>
							:	<>
									<Table>
										<TableHead>
											<TableRow>
												<TableHeader className='w-1/12 rounded-tl-2xl'>S.No</TableHeader>
												<TableHeader className='w-1/2'>Title</TableHeader>
												<TableHeader className='w-[120px] rounded-tr-lg text-center'>Actions</TableHeader>
											</TableRow>
										</TableHead>
									</Table>
									<div className='scrollbar-none overflow-y-auto rounded-b-2xl'>
										<Table>
											<TableBody>
												{fetchTopics.map((topic, index) => (
													<TableRow key={topic.id}>
														<TableCell className={`${fetchTopics.length - 1 === index ? "rounded-bl-2xl" : ""} w-1/12`}>{index + 1}</TableCell>
														<TableCell className='w-1/2'>{topic.title || topic.topicName}</TableCell>
														<TableCell className={`${fetchTopics.length - 1 === index ? "rounded-br-2xl" : ""} w-[120px]`}>
															<div className='flex items-center justify-center space-x-2'>
																<Button
																	variant='gradientAmber'
																	icon={Edit}
																	className='h-6 w-6 rounded-lg'
																	size='sm'
																	onClick={() => handleOpenEditModal("",topic)}
																	disabled={creating || deleting}
																/>
																<Button
																	variant='gradientRose'
																	icon={Trash2}
																	className='h-6 w-6 rounded-lg'
																	onClick={() =>
																		setDeleteModal({
																			open: true,
																			topic,
																		})
																	}
																	disabled={creating || updating}
																/>
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
