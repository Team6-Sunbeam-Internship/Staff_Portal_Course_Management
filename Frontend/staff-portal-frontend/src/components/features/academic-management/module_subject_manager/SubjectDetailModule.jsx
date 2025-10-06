export const SubjectDetailModal = ({ isOpen, onClose, module }) => {
	if (!module) return null;
	return (
		<Modal isOpen={isOpen} onClose={onClose} size='lg'>
			<ModalHeader
				title={`Subjects for: ${module?.title}`}
				subtitle={`Total Subjects: ${module?.subjects.length} | Theory: ${module?.theoryHours}h | Practical: ${module?.practicalHours}h`}
				onClose={onClose}
			/>
			<ModalBody>
				<VStack spacing='md'>
					<p className='text-sm text-gray-600 dark:text-gray-400'>
						Please confirm the Module Coordinator's expertise aligns
						with all the subjects listed below before assignment.
					</p>
					<Table>
						<TableHead>
							<TableRow>
								<TableHeader className='w-1/12'>
									S.No
								</TableHeader>
								<TableHeader className='w-3/5'>
									Subject Name
								</TableHeader>
								<TableHeader className='w-1/5 text-right'>
									Hours
								</TableHeader>
							</TableRow>
						</TableHead>
						<TableBody>
							{module?.subjects.map((subject, index) => (
								<TableRow key={subject.id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{subject.name}</TableCell>
									<TableCell className='text-right'>
										{subject.hours} hrs
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</VStack>
			</ModalBody>
		</Modal>
	);
};
