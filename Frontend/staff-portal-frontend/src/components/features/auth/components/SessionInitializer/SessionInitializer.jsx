import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
	useCheckSessionQuery,
	useGetMenuItemsQuery,
	useGetRoleBasedMenuQuery,
	useGetStaffMenuAccessQuery,
	useGetBatchCyclesQuery,
	useGetCourseTypesQuery,
	useGetPremisesQuery,
	useGetInfrastructuresQuery,
	useGetStaffQuery,
} from "../../../../../store/api";
import API_CONFIG from "../../../../../config/api.config";
import {
	setAuthData,
	clearAuthData,
	setInitializationComplete,
} from "../../../../../store/slices";
// import { LoginModal } from "../LoginModal";
import { LoadingSpinner } from "../../../../common";
const SessionInitializer = ({ children: e }) => {
	const { BFF_BASE_URL, ENDPOINTS } = API_CONFIG;
	const s = useDispatch(),
		{ data: t, isLoading: a, error: i } = useCheckSessionQuery(),
		n = t?.roles?.[0],
		o = !!t?.user,
		// { data: r, isLoading: c } = useGetMenuItemsQuery(void 0, {
		{ isLoading: c } = useGetMenuItemsQuery(void 0, {
			skip: !o || "ADMIN" !== n,
		}),
		{ data: l, isLoading: u } = useGetRoleBasedMenuQuery(void 0, {
			skip: !o || "ADMIN" !== n,
		}),
		{ data: d, isLoading: m } = useGetStaffMenuAccessQuery(void 0, {
			skip: !o || "ADMIN" !== n,
		}),
		// { data: f, isLoading: g } = useGetBatchCyclesQuery(void 0, {
		{ isLoading: g } = useGetBatchCyclesQuery(void 0, {
			skip: !o || "ADMIN" !== n,
		}),
		// { data: p, isLoading: S } = useGetCourseTypesQuery(void 0, {
		{ isLoading: S } = useGetCourseTypesQuery(void 0, {
			skip: !o || "ADMIN" !== n,
		}),
		{ data: A, isLoading: h } = useGetPremisesQuery(void 0, {
			skip: !o || "ADMIN" !== n,
		}),
		{ data: I, isLoading: y } = useGetInfrastructuresQuery(void 0, {
			skip: !o || "ADMIN" !== n,
		}),
		{ data: C, isLoading: x } = useGetStaffQuery(void 0, {
			skip: !o || "ADMIN" !== n,
		});
	useEffect(() => {
		if (t?.user) {
			const e = [];
			if (l && n) {
				const s = l.filter((e) => e.role === n);
				e.push(...s.map((e) => e.menuPath));
			}
			d &&
				t.user.id &&
				d
					.filter((e) => e.staffId === t.user.id)
					.forEach((s) => {
						if (s.allowed && !e.includes(s.menuPath))
							e.push(s.menuPath);
						else if (!s.allowed) {
							const t = e.indexOf(s.menuPath);
							t > -1 && e.splice(t, 1);
						}
					}),
				s(
					setAuthData({
						user: t.user,
						permissions: t.permissions || [],
						accessibleMenus: e,
						staffExceptions: d || [],
					})
				);
		} else i && s(clearAuthData());
	}, [s, t, i, l, d, n]),
		useEffect(() => {
			if (o && "ADMIN" === n) {
				const e = !c && !u && !m && !g && !S && !h && !y && !x;
				e && s(setInitializationComplete());
			} else o && "ADMIN" !== n && s(setInitializationComplete());
		}, [s, o, n, c, u, m, g, S, h, y, x]);
	if (a)
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	if (401 === i?.status || !o)
		return window.location.href = `${BFF_BASE_URL}${ENDPOINTS.AUTH.LOGIN}`, null;
	if (o && "ADMIN" === n && (c || u || m || g || S || h || y || x))
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<LoadingSpinner size='lg' />
					<p className='mt-4 text-gray-600'>
						Loading application data...
					</p>
				</div>
			</div>
		);
	return <>{e}</>;
};

export default SessionInitializer;