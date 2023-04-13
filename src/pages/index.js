import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useState } from "react";
import useFormInput from "../../hooks/useFormInput";

function Home({ userClaims }) {
  const userData = useUser();
  const userSession = useSession();
  const supabase = useSupabaseClient();
  
  const { inputs, onChange, resetForm } = useFormInput({ email: "", password: "" , claims_admin: true });

  console.log(inputs)

  async function signInWithEmail({...inputs}) {
    console.log({
      email: inputs.email,
      password: inputs.password,
    })
    const { data, error } = await supabase.auth.signUp({
      email: 'tiagofsanchez@gmail.com',
      password: '123456789',
    })
    console.log(error)
  }

  const onFormSubmitHandler = async (e) => { 
    e.preventDefault();
    signInWithEmail({...inputs});

  }



  console.log({ userData, userSession, userClaims });

  return (
    <main className="  p-20 grid gap-10">
      <h1 className="text-5xl text-center">
        This is a test for credere 2sided login and Auth
      </h1>
      {!userSession ? (
        <>
          <p className="text-center">This will be the login page</p>
          <div className="w-96 m-auto">
            <form onSubmit={onFormSubmitHandler}>
              <label className="block grid">
                <input
                  type="text"
                  name="email"
                  value={inputs.email}
                  id="email"
                  autoComplete="email"
                  className="form-input rounded mt-1 text-black"
                  placeholder="your@email.com"
                  onChange={onChange}
                />
              </label>
              <label className="block grid">
                <input
                  name="password"
                  value={inputs.password}
                  type="password"
                  id="password"
                  autoComplete="password"
                  className="form-input rounded mt-1 text-black"
                  placeholder="your password"
                  onChange={onChange}
                />
              </label>
              <button className="bg-gradient-to-r from-pink-500 to-violet-500 p-2 mt-4 rounded text-white  shadow-sm ring-2 ring-pink-900 hover:bg-pink-200 hover:ring-pink-700 font-semibold  ">
                I&apos;m in
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="m-auto grid gap-10">
          <p>You are logedin as {userData?.email}</p>
          <button onClick={() => supabase.auth.signOut()}>Sign Out </button>
        </div>
      )}
    </main>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const userClaims = await supabase.rpc("get_my_claims", {});
  return {
    props: {
      userClaims: userClaims?.data || null,
    },
  };
};

export default Home;
