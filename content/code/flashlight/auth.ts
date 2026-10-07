import { apiSlice } from "../apiSlice";
import {
  getAccessTkAction,
  signInAction,
  signUpAction,
} from "@/actions/auth-action";


const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      async queryFn(signUpData) {
        const res = await signUpAction(signUpData);
        return res.success ? { data: res.data } : { error: res.error };
      },
      onQueryStarted: updateAuthCache,
    }),

    signIn: builder.mutation({
      async queryFn(signInData) {
        const res = await signInAction(signInData);
        return res.success ? { data: res.data } : { error: res.error };
      },
      onQueryStarted: updateAuthCache,
    }),

    getAccessTk: builder.query({
      async queryFn() {
        const res = await getAccessTkAction();
        return res.success ? { data: res.data } : { error: res.error };
      },
      // 15 minutes — matches the access-token lifetime.
      keepUnusedDataFor: 900,
    }),
  }),
});

