import { useEffect, useState } from "react";

export const TopicSelectionModal = ({ isOpen, onClose, onSave, initialTopics, subjects, sections }) => {
	const subjectOptions = subjects.map((sub) => ({
		value: sub.subjectId,
		label: sub.subjectName,
	}));

	const [selectedSubjectId, setSelectedSubjectId] = useState("");
	const [selectedSectionId, setSelectedSectionId] = useState("");
	const [tempTopics, setTempTopics] = useState(
		initialTopics
	);

	// 2. Get Topics based on selectedSectionId
	const currentSection = sections.find(
		(s) => s.sectionId === selectedSectionId
	);
	const topics = currentSection ? currentSection.topics : [];

	useEffect(() => {
		// Reset section when subject changes
		setSelectedSectionId("");
	}, [selectedSubjectId]);

	const handleTopicToggle = (topicId, topicName, sectionId, subjectId) => {
		setTempTopics((prevTempTopics) => {
			// Find the index of the subject in the temp state
			const subjectIndex = prevTempTopics.findIndex(
				(s) => s.subjectId === subjectId
			);

			// If the subject isn't tracked yet, create a new structure for it
			if (subjectIndex === -1) {
				const newSubject = subjects.find(
					(s) => s.subjectId === subjectId
				);
				const newSection = newSubject.sections.find(
					(s) => s.sectionId === sectionId
				);
				return [
					...prevTempTopics,
					{
						subjectId,
						subjectName: newSubject.subjectName,
						sections: [
							{
								sectionId,
								sectionName: newSection.sectionName,
								topics: [
									{
										id: topicId,
										name: topicName,
										checked: true,
									},
								],
							},
						],
					},
				];
			}

			// Subject exists, now check for the section
			const newSubjects = [...prevTempTopics];
			const subject = newSubjects[subjectIndex];
			const sectionIndex = subject.sections.findIndex(
				(s) => s.sectionId === sectionId
			);

			if (sectionIndex === -1) {
				// Section doesn't exist under this subject, add it and the topic
				const newSectionData = subjects.find(
					(s) => s.subjectId === subjectId
				).sections.find((s) => s.sectionId === sectionId);
				subject.sections.push({
					sectionId,
					sectionName: newSectionData.sectionName,
					topics: [{ id: topicId, name: topicName, checked: true }],
				});
			} else {
				// Section and Subject exist, modify topics array
				const section = subject.sections[sectionIndex];
				const topicIndex = section.topics.findIndex(
					(t) => t.id === topicId
				);

				if (topicIndex === -1) {
					// Topic is being checked (added)
					section.topics.push({
						id: topicId,
						name: topicName,
						checked: true,
					});
				} else {
					// Topic is being unchecked (removed)
					section.topics.splice(topicIndex, 1);
				}

				// Cleanup: Remove section if it has no topics
				if (section.topics.length === 0) {
					subject.sections.splice(sectionIndex, 1);
				}
			}

			// Cleanup: Remove subject if it has no sections
			if (subject.sections.length === 0) {
				newSubjects.splice(subjectIndex, 1);
			}

			return newSubjects;
		});
	};

	const isTopicChecked = (topicId, sectionId, subjectId) => {
		const subject = tempTopics.find((s) => s.subjectId === subjectId);
		if (!subject) return false;
		const section = subject.sections.find((s) => s.sectionId === sectionId);
		if (!section) return false;
		return section.topics.some((t) => t.id === topicId);
	};

	const handleSave = () => {
		// Flatten the complex tempTopics structure into the format expected by the main component state
		const finalTopics = tempTopics.flatMap((subject) =>
			subject.sections.map((section) => ({
				subjectName: subject.subjectName,
				sectionName: section.sectionName,
				topics: section.topics.map((t) => ({ name: t.name })),
			}))
		);

		onSave(finalTopics);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='xl'>
			<ModalHeader
				title='Add Topics'
				subtitle='Select subject, section, and topics covered'
			/>
			<ModalBody>
				<VStack spacing='lg'>
					{/* Subject Selection Dropdown */}
					<FormField label='Select Subject' required>
						<Select
							value={selectedSubjectId}
							onChange={(e) =>
								setSelectedSubjectId(e.target.value)
							}
							options={subjectOptions}
							placeholder='Choose a Subject'
						/>
					</FormField>

					{/* Sections and Topics Grid */}
					<Grid columns={{ base: 1, md: 2 }} gap='lg'>
						<GridItem>
							<Card>
								<CardHeader title='Sections' />
								<CardBody>
									<VStack spacing='sm'>
										{sections.length > 0 ? (
											sections.map((section) => (
												<Button
													key={section.sectionId}
													variant='ghost'
													active={
														selectedSectionId ===
														section.sectionId
													}
													onClick={() =>
														setSelectedSectionId(
															section.sectionId
														)
													}
													className='w-full justify-start'
													leftIcon={
														<BookOpen className='w-4 h-4' />
													}
												>
													{section.sectionName}
												</Button>
											))
										) : (
											<div className='text-center py-4 text-gray-400'>
												Select a Subject to view
												sections.
											</div>
										)}
									</VStack>
								</CardBody>
							</Card>
						</GridItem>
						<GridItem>
							<Card>
								<CardHeader
									title={`Topics in: ${
										currentSection?.sectionName || "N/A"
									}`}
								/>
								<CardBody>
									<VStack spacing='sm'>
										{topics.length > 0 ? (
											topics.map((topic) => (
												<label
													key={topic.id}
													className='flex items-center space-x-2 text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition'
												>
													<input
														type='checkbox'
														className='rounded text-blue-600 focus:ring-blue-500'
														checked={isTopicChecked(
															topic.id,
															selectedSectionId,
															selectedSubjectId
														)}
														onChange={() =>
															handleTopicToggle(
																topic.id,
																topic.name,
																selectedSectionId,
																selectedSubjectId
															)
														}
													/>
													<span>{topic.name}</span>
												</label>
											))
										) : (
											<div className='text-center py-4 text-gray-400'>
												{selectedSectionId
													? "No topics available."
													: "Select a Section to view topics."}
											</div>
										)}
									</VStack>
								</CardBody>
							</Card>
						</GridItem>
					</Grid>
				</VStack>
			</ModalBody>
			<ModalFooter>
				<Button variant='secondary' onClick={onClose}>
					Cancel
				</Button>
				<Button
					variant='primary'
					onClick={handleSave}
					disabled={tempTopics.length === 0}
				>
					{`Add Topics (${
						tempTopics
							.flatMap((s) => s.sections)
							.flatMap((s) => s.topics).length
					})`}
				</Button>
			</ModalFooter>
		</Modal>
	);
};
