// import { Routes, Route, Navigate } from "react-router";
// import { ProtectedRoutes, AppLayout } from "../components";
// import {
// 	DashboardPage,
// 	AcademicManagementPage,
// 	InfrastructureManagementPage,
// 	StaffManagementPage,
// 	StudentOperationsPage,
// 	SchedulingSessionsPage,
// 	SystemAdministrationPage,
// 	ReportsDocumentationPage,
// 	NotFoundPage,
// 	UnauthorizedPage,
// } from "../pages";
// import {
// 	CourseTypeList,
// 	CourseList,
// 	ModuleList,
// 	SubjectList,
// 	SectionList,
// 	TopicList,
// 	BatchCycleList,
// 	PremiseList,
// 	InfrastructureList,
// 	StaffList,
// 	RoleAssignmentForm,
// 	CoordinatorAssignmentForm,
// 	StudentList,
// 	CourseGroupList,
// 	ScheduleList,
// 	SessionList,
// 	MenuItemList,
// 	RoleMenuAssignment,
// } from "../components/features";
// const AppRoutes = () => {
// 	return (
// 		<Routes>
// 			<Route path='/' element={<Navigate to='/dashboard' replace />} />
// 			<Route path='/unauthorized' element={<UnauthorizedPage />} />

// 			<Route
// 				path='/*'
// 				element={
// 					<ProtectedRoutes>
// 						<AppLayout>
// 							<Routes>
// 								<Route
// 									path='/dashboard'
// 									element={<DashboardPage />}
// 								/>

// 								<Route
// 									path='/academic-management'
// 									element={<AcademicManagementPage />}
// 								>
// 									<Route
// 										index
// 										element={
// 											<Navigate
// 												to='/academic-management/course-types'
// 												replace
// 											/>
// 										}
// 									/>
// 									<Route
// 										path='course-types'
// 										element={<CourseTypeList />}
// 									/>
// 									<Route
// 										path='courses'
// 										element={<CourseList />}
// 									/>
// 									<Route
// 										path='modules'
// 										element={<ModuleList />}
// 									/>
// 									<Route
// 										path='subjects'
// 										element={<SubjectList />}
// 									/>
// 									<Route
// 										path='sections'
// 										element={<SectionList />}
// 									/>
// 									<Route
// 										path='topics'
// 										element={<TopicList />}
// 									/>
// 								</Route>

// 								<Route
// 									path='/infrastructure-management'
// 									element={<InfrastructureManagementPage />}
// 								>
// 									<Route
// 										index
// 										element={
// 											<Navigate
// 												to='/infrastructure-management/batch-cycles'
// 												replace
// 											/>
// 										}
// 									/>
// 									<Route
// 										path='batch-cycles'
// 										element={<BatchCycleList />}
// 									/>
// 									<Route
// 										path='premises'
// 										element={<PremiseList />}
// 									/>
// 									<Route
// 										path='infrastructure'
// 										element={<InfrastructureList />}
// 									/>
// 								</Route>

// 								<Route
// 									path='/staff-management'
// 									element={<StaffManagementPage />}
// 								>
// 									<Route
// 										index
// 										element={
// 											<Navigate
// 												to='/staff-management/staff'
// 												replace
// 											/>
// 										}
// 									/>
// 									<Route
// 										path='staff'
// 										element={<StaffList />}
// 									/>
// 									<Route
// 										path='role-assignment'
// 										element={<RoleAssignmentForm />}
// 									/>
// 									<Route
// 										path='course-assignment'
// 										element={<CoordinatorAssignmentForm />}
// 									/>
// 								</Route>

// 								<Route
// 									path='/student-operations'
// 									element={<StudentOperationsPage />}
// 								>
// 									<Route
// 										index
// 										element={
// 											<Navigate
// 												to='/student-operations/students'
// 												replace
// 											/>
// 										}
// 									/>
// 									<Route
// 										path='students'
// 										element={<StudentList />}
// 									/>
// 									<Route
// 										path='course-groups'
// 										element={<CourseGroupList />}
// 									/>
// 								</Route>

// 								<Route
// 									path='/scheduling-sessions'
// 									element={<SchedulingSessionsPage />}
// 								>
// 									<Route
// 										index
// 										element={
// 											<Navigate
// 												to='/scheduling-sessions/schedule'
// 												replace
// 											/>
// 										}
// 									/>
// 									<Route
// 										path='schedule'
// 										element={<ScheduleList />}
// 									/>
// 									<Route
// 										path='sessions'
// 										element={<SessionList />}
// 									/>
// 								</Route>

// 								<Route
// 									path='/system-administration'
// 									element={<SystemAdministrationPage />}
// 								>
// 									<Route
// 										index
// 										element={
// 											<Navigate
// 												to='/system-administration/menu-items'
// 												replace
// 											/>
// 										}
// 									/>
// 									<Route
// 										path='menu-items'
// 										element={<MenuItemList />}
// 									/>
// 									<Route
// 										path='role-based-menu'
// 										element={<RoleMenuAssignment />}
// 									/>
// 								</Route>

// 								<Route
// 									path='/reports-documentation'
// 									element={<ReportsDocumentationPage />}
// 								>
// 									<Route
// 										index
// 										element={
// 											<div>
// 												Reports Dashboard Coming Soon
// 											</div>
// 										}
// 									/>
// 								</Route>

// 								<Route path='*' element={<NotFoundPage />} />
// 							</Routes>
// 						</AppLayout>
// 					</ProtectedRoutes>
// 				}
// 			/>
// 		</Routes>
// 	);
// };

// export default AppRoutes;

import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { RoleGuard } from "./RoleGuard";
import { RouteGuard } from "./RouteGuard";
import {
	AcademicManagementPage,
	DashboardPage,
	UnauthorizedPage,
	NotFoundPage,
	InfrastructureManagementPage,
	ProfilePage,
	ReportsDocumentationPage,
	SchedulingSessionsPage,
	StaffManagementPage,
	StudentOperationsPage,
	SystemAdministrationPage,
} from "../pages";

const AppRoutes = () => {
	return (
		<Routes>
			<Route path='/login' element={<Navigate to='/' replace />} />

			<Route
				path='/academic-management/*'
				element={
					<ProtectedRoutes>
						<RoleGuard
							allowedRoles={["ADMIN", "COURSE_COORDINATOR"]}
							requiredMenuPath='/academic-management'
						>
							<RouteGuard>
								<AcademicManagementPage />
							</RouteGuard>
						</RoleGuard>
					</ProtectedRoutes>
				}
			/>

			<Route
				path='/'
				element={
					<ProtectedRoutes>
						<RouteGuard>
							<Navigate to='/dashboard' replace />
						</RouteGuard>
					</ProtectedRoutes>
				}
			/>

			<Route
				path='/dashboard'
				element={
					<ProtectedRoutes>
						<RouteGuard>
							<DashboardPage />
						</RouteGuard>
					</ProtectedRoutes>
				}
			/>

			<Route path='/unauthorized' element={<UnauthorizedPage />} />
			<Route path='*' element={<NotFoundPage />} />

			<Route
				path='/infrastructure-management/*'
				element={
					<ProtectedRoutes>
						<RoleGuard
							allowedRoles={["ADMIN"]}
							requiredMenuPath='/infrastructure-management'
						>
							<RouteGuard>
								<InfrastructureManagementPage />
							</RouteGuard>
						</RoleGuard>
					</ProtectedRoutes>
				}
			/>

			<Route
				path='/profile'
				element={
					<ProtectedRoutes>
						<RouteGuard>
							<ProfilePage />
						</RouteGuard>
					</ProtectedRoutes>
				}
			/>

			<Route
				path='/reports-documentation/*'
				element={
					<ProtectedRoutes>
						<RoleGuard
							allowedRoles={["ADMIN", "COURSE_COORDINATOR"]}
							requiredMenuPath='/reports-documentation'
						>
							<RouteGuard>
								<ReportsDocumentationPage />
							</RouteGuard>
						</RoleGuard>
					</ProtectedRoutes>
				}
			/>

			<Route
				path='/scheduling-sessions/*'
				element={
					<ProtectedRoutes>
						<RoleGuard
							allowedRoles={["ADMIN", "COURSE_COORDINATOR"]}
							requiredMenuPath='/scheduling-sessions'
						>
							<RouteGuard>
								<SchedulingSessionsPage />
							</RouteGuard>
						</RoleGuard>
					</ProtectedRoutes>
				}
			/>

			<Route
				path='/staff-management/*'
				element={
					<ProtectedRoutes>
						<RoleGuard
							allowedRoles={["ADMIN"]}
							requiredMenuPath='/staff-management'
						>
							<RouteGuard>
								<StaffManagementPage />
							</RouteGuard>
						</RoleGuard>
					</ProtectedRoutes>
				}
			/>

			<Route
				path='/student-operations/*'
				element={
					<ProtectedRoutes>
						<RoleGuard
							allowedRoles={["ADMIN", "COURSE_COORDINATOR"]}
							requiredMenuPath='/student-operations'
						>
							<RouteGuard>
								<StudentOperationsPage />
							</RouteGuard>
						</RoleGuard>
					</ProtectedRoutes>
				}
			/>

			<Route
				path='/system-adminstration'
				element={
					<ProtectedRoutes>
						<RoleGuard
							allowedRoles={["ADMIN"]}
							requiredMenuPath='/system-adminstration'
						>
							<RouteGuard>
								<SystemAdministrationPage />
							</RouteGuard>
						</RoleGuard>
					</ProtectedRoutes>
				}
			/>
		</Routes>
	);
};

export default AppRoutes;