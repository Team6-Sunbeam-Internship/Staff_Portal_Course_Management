import baseApi from "./baseApi";
import API_CONFIG from "../../config/api.config";

export const reportsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getReports: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.REPORTS.SCHEDULE_REPORTS,
				params,
			}),
			providesTags: ["Report"],
			transformResponse: (response) => response.data || response,
		}),
		generateScheduleReport: builder.mutation({
			query: (reportData) => ({
				url: API_CONFIG.ENDPOINTS.REPORTS.SCHEDULE_REPORTS,
				method: "POST",
				body: reportData,
			}),
			invalidatesTags: ["Report"],
		}),
		downloadReport: builder.mutation({
			query: (reportId) => ({
				url: `${API_CONFIG.ENDPOINTS.REPORTS.SCHEDULE_REPORTS}/${reportId}/download`,
				method: "GET",
				responseHandler: (response) => response.blob(),
			}),
		}),
		getCertificates: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.REPORTS.STUDENT_CERTIFICATES,
				params,
			}),
			providesTags: ["Certificate"],
			transformResponse: (response) => response.data || response,
		}),
		generateCertificate: builder.mutation({
			query: (certificateData) => ({
				url: API_CONFIG.ENDPOINTS.REPORTS.STUDENT_CERTIFICATES,
				method: "POST",
				body: certificateData,
			}),
			invalidatesTags: ["Certificate"],
		}),
		downloadCertificate: builder.mutation({
			query: (certificateId) => ({
				url: `${API_CONFIG.ENDPOINTS.REPORTS.STUDENT_CERTIFICATES}/${certificateId}/download`,
				method: "GET",
				responseHandler: (response) => response.blob(),
			}),
		}),
		exportData: builder.mutation({
			query: (exportParams) => ({
				url: API_CONFIG.ENDPOINTS.REPORTS.EXPORT_DATA,
				method: "POST",
				body: exportParams,
				responseHandler: (response) => response.blob(),
			}),
		}),
		generateDocument: builder.mutation({
			query: (documentData) => ({
				url: API_CONFIG.ENDPOINTS.REPORTS.DOCUMENT_GENERATION,
				method: "POST",
				body: documentData,
			}),
			invalidatesTags: ["Report"],
		}),
	}),
	overrideExisting: false,
});
export const {
	useGetReportsQuery,
	useGenerateScheduleReportMutation,
	useDownloadReportMutation,
	useGetCertificatesQuery,
	useGenerateCertificateMutation,
	useDownloadCertificateMutation,
	useExportDataMutation,
	useGenerateDocumentMutation,
} = reportsApi;
