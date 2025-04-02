import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens, clearTokens } from "../Token/tokenSlice";
import { showAlert } from "../../Features/alerter/alertSlice";

const API_BASE_URL = "cliqi-backend.vercel.app/api/";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token =
      getState()?.token?.accessToken || localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken =
      api.getState()?.token?.refreshToken ||
      localStorage.getItem("refreshToken");

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const { accessToken, refreshToken: newRefreshToken } =
          refreshResult.data;
        // Update tokens in state and localStorage
        api.dispatch(
          setTokens({
            accessToken,
            refreshToken: newRefreshToken,
          })
        );
        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // If refresh fails, clear tokens and notify user
        api.dispatch(clearTokens());
        api.dispatch(
          showAlert({
            message: "Session expired. Please log in again.",
            status: "error",
            position: { top: "20px", right: "20px" },
            autoHideDuration: 5000,
          })
        );
      }
    } else {
      api.dispatch(clearTokens());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Data"],
  endpoints: (builder) => ({
    getData: builder.query({
      query: (url) => url,
      providesTags: (result, error, url) => [{ type: "Data", id: url }],
    }),
    addData: builder.mutation({
      query: (data) => ({
        url: data.url,
        method: "POST",
        body: data.body,
      }),
      onQueryStarted: async (
        { customMessages, reqName, ...arg },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            showAlert({
              message:
                customMessages?.success ||
                `${reqName || data.reqName || "Item"} added successfully!`,
              status: "success",
            })
          );
        } catch (error) {
          dispatch(
            showAlert({
              message:
                customMessages?.error ||
                error.message ||
                `Failed to add ${reqName || "item"}.`,
              status: "error",
            })
          );
        }
      },
    }),
    editData: builder.mutation({
      query: (data) => ({
        url: data.url,
        method: "PUT",
        body: data.body,
      }),
      onQueryStarted: async (
        { customMessages, reqName, ...arg },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            showAlert({
              message:
                customMessages?.success ||
                `${reqName || data.reqName || "Item"} updated successfully!`,
              status: "success",
            })
          );
        } catch (error) {
          dispatch(
            showAlert({
              message:
                customMessages?.error ||
                error.message ||
                `Failed to update ${reqName || "item"}.`,
              status: "error",
            })
          );
        }
      },
    }),
    deleteData: builder.mutation({
      query: (data) => ({
        url: data.url,
        method: "DELETE",
        body: data.body,
      }),
      onQueryStarted: async (
        { customMessages, reqName, ...arg },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            showAlert({
              message:
                customMessages?.success ||
                `${reqName || data.reqName || "Item"} deleted successfully!`,
              status: "success",
            })
          );
        } catch (error) {
          dispatch(
            showAlert({
              message:
                customMessages?.error ||
                error.message ||
                `Failed to delete ${reqName || "item"}.`,
              status: "error",
            })
          );
        }
      },
    }),
  }),
});

export const {
  useGetDataQuery,
  useAddDataMutation,
  useEditDataMutation,
  useDeleteDataMutation,
} = apiSlice;
