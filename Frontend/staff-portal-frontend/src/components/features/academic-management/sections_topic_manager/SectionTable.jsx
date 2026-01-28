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
import { Edit, List, Trash2 } from "lucide-react";
import { SectionForm } from "./SectionForm";
import { motion, AnimatePresence } from "motion/react";

export const SectionTable = ({
	isLoadingCourseHierarchy,
	selectedSections,
	handleOpenEditModal,
	creating,
	updating,
	deleting,
	setSelectedSectionId,
	setSelectedSectionTitle,
	deleteModal,
	setDeleteModal,
	handleDeleteSection,
	filters,
}) => {
	const isAllFiltersSelected = filters.courseTypeId && filters.batchCycleId && filters.courseCode && filters.moduleId && filters.subjectId;

	return (
		<>
			<Card className='h-[520px]'>
				<CardBody>
					<AnimatePresence mode='wait'>
						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 12 }}
							transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
							className='flex-1'>
							{isLoadingCourseHierarchy ?
								<SkeletonTable />
							: !isAllFiltersSelected ?
								<EmptyState
									icon={<List className='h-12 w-12' />}
									title={`No Sections found`}
									description='Please select all the filters to view the section lists.'
								/>
							: selectedSections?.length === 0 ?
								<EmptyState
									icon={<List className='h-12 w-12' />}
									title={`No Sections found`}
									description='Please select all the filters to view the section lists.'
								/>
							:	<>
									<Table>
										<TableHead>
											<TableRow>
												<TableHeader className='w-1/12 rounded-tl-2xl'>S.No</TableHeader>
												<TableHeader className='w-1/3'>Title</TableHeader>
												<TableHeader className='w-[120px] rounded-tr-lg text-center'>Actions</TableHeader>
												<TableHeader className='w-[120px] rounded-tr-lg text-center'>View Topics</TableHeader>
											</TableRow>
										</TableHead>
									</Table>
									<div className='scrollbar-none h-[450px] overflow-y-auto rounded-b-2xl'>
										<Table>
											<TableBody>
												{selectedSections.map((section, index) => (
													<TableRow key={section.id}>
														<TableCell className={`${selectedSections?.length - 1 === index ? "rounded-bl-2xl" : ""} w-1/12`}>{index + 1}</TableCell>
														<TableCell className='w-1/3'>{section.title || section.sectionName}</TableCell>
														<TableCell className='w-[120px]'>
															<div className='flex items-center justify-center space-x-2'>
																<Button
																	variant='gradientAmber'
																	icon={Edit}
																	className='h-6 w-6 rounded-lg'
																	size='sm'
																	onClick={() => handleOpenEditModal(section, "")}
																	disabled={creating || deleting}
																/>
																<Button
																	variant='gradientRose'
																	icon={Trash2}
																	className='h-6 w-6 rounded-lg'
																	onClick={() =>
																		setDeleteModal({
																			open: true,
																			section,
																		})
																	}
																	disabled={creating || updating}
																/>
															</div>
														</TableCell>
														<TableCell
															className={`${selectedSections.length - 1 === index ? "rounded-br-2xl" : ""} w-[120px] text-center`}
															handleClick={() => {
																setSelectedSectionId(section.id);
																setSelectedSectionTitle(section.title);
															}}>
															<Button variant='gradientEmerald' className='h-8 rounded-xl'>
																view topics
															</Button>
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
