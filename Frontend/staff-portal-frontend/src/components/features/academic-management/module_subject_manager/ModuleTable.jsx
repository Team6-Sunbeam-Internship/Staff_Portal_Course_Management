import {
	Button,
	Card,
	CardBody,
	ConfirmDialog,
	EmptyState,
	SkeletonTable,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../layout";
import { Edit, List, Trash2 } from "lucide-react";

const ModuleTable = ({
	isLoadingCourseHierarchy,
	courseHierarchy,
	handleOpenEditModal,
	creatingModule,
	updatingModule,
	deletingModule,
	setSelectedModuleId,
	setSelectedModuleTitle,
	deleteModal,
	setDeleteModal,
	handleDeleteModule,
}) => {
	console.log("courseHierarchy", courseHierarchy);
	return (
		<>
			<Card className='h-[525px]'>
				<CardBody>
					{isLoadingCourseHierarchy ?
						<SkeletonTable />
					: courseHierarchy?.length === 0 || courseHierarchy?.modules?.length === 0 ?
						<EmptyState
							icon={<List className='h-12 w-12' />}
							title={`No Modules found`}
							description='Please select the batch cycle and course to view the modules or add a new one.'
						/>
					:	<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-[14%] rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-[16%]'>Title</TableHeader>
										<TableHeader className='w-[16%]'>Theory Hrs</TableHeader>
										<TableHeader className='w-[18%]'>Practical Hrs</TableHeader>
										<TableHeader className='w-[16%] text-center'>Actions</TableHeader>
										<TableHeader className='w-[22%] rounded-tr-2xl text-center'>[View Subject(s)]</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='scrollbar-none h-[450px] overflow-y-auto rounded-b-2xl'>
								<Table>
									<TableBody>
										{courseHierarchy?.modules?.map((module, index) => (
											<TableRow key={module.id}>
												<TableCell className={`w-[14%] ${index === courseHierarchy?.modules?.length - 1 ? "rounded-bl-2xl" : ""}`}>
													{index + 1}
												</TableCell>
												<TableCell className='w-[16%]'>{module.title || module.moduleName}</TableCell>
												<TableCell className='w-[16%]'>{module.theoryHours}</TableCell>
												<TableCell className='w-[18%]'>{module.practicalHours}</TableCell>
												<TableCell className='w-[16%]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='gradientAmber'
															icon={Edit}
															className='h-6 w-6 rounded-lg'
															size='sm'
															onClick={() => handleOpenEditModal(module)}
															disabled={creatingModule || deletingModule}
														/>
														<Button
															variant='gradientRose'
															icon={Trash2}
															className='h-6 w-6 rounded-lg'
															onClick={() =>
																setDeleteModal({
																	open: true,
																	module,
																})
															}
															disabled={creatingModule || updatingModule}
														/>
													</div>
												</TableCell>
												<TableCell
													className={`w-[22%] cursor-pointer dark:text-rose-300 dark:hover:text-cyan-300 ${index === courseHierarchy?.modules?.length - 1 ? "rounded-br-2xl" : ""}`}
													handleClick={() => {
														setSelectedModuleId(module.id);
														setSelectedModuleTitle(module.moduleName);
													}}>
													[View Subject(s)]
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</>
					}
				</CardBody>
			</Card>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, module: null })}
				onConfirm={() => handleDeleteModule()}
				title='Delete Module'
				message={`Are you sure you want to delete "${deleteModal.module?.title || deleteModal.module?.moduleName}"? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};

export default ModuleTable;
