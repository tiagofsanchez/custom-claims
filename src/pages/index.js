import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";

function Home({ userClaims }) {
  const userData = useUser();
  const userSession = useSession();
  const supabase = useSupabaseClient();

  console.log({ userData, userSession, userClaims });

  const handleAuthStateChange = async (event, session) => {
    console.log({event, session})
    const uid = session.user.id
    if (event === 'SIGNED_IN') {
      // Add custom claim to user's JWT
      const { error } = await supabase.rpc('set_claim', {uid, userrole, Broker});

      if (error) {
        console.log(error);
      } else {
        console.log('Custom claim added to user JWT');
      }
    }
  };


  return (
    <main className="  p-20 grid gap-10">
      <h1 className="text-5xl text-center">
        This is a test for credere 2sided login and Auth
      </h1>
      {!userSession ? (
        <>
          <p className="text-center">This will be the login page</p>
          <div className="w-96 m-auto">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              onAuthStateChange={handleAuthStateChange}

              // callbackUrl={`${window.location.origin}/callback`}
            />
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
