import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Home({ userClaims }) {
  const userData = useUser();
  const userSession = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  console.log({ userData, userSession, userClaims });

  useEffect(() => {
    if (userData?.app_metadata.userrole == "Broker") {
      void router.replace("/broker-dashboard");
    } else if (userData?.app_metadata.userrole == "Customer") {
      void router.replace("/customer-dashboard");
    } else if (userSession) {
      void router.replace("/welcome");
    }
  }, [userData, userSession, router]);

  return (
    <main className="p-20 grid gap-10">
      <h1 className="text-5xl text-center">
        This is a test for credere 2sided login and Auth
      </h1>

      <p className="text-center">This will be the login page</p>
      <div className="w-96 m-auto">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
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
