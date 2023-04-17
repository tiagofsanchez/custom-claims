import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { requestToBodyStream } from "next/dist/server/body-streams";
import { useRouter } from "next/router";

const WelcomePage = () => {
  const userData = useUser();
  const userSession = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function updateProfileAsBroker() {
    try {
      const updates = {
        uid: userData.id,
        // claim: "userrole",
        // value: "Broker",
      };
      let { error, data } = await supabase?.rpc('get_claims', {...updates});
      if (error) throw error;
      console.log({ data, updates });
    } catch (error) {
      alert(JSON.stringify(error, null, 2));
      console.log({ error, updates });
    }
  }

  console.log({ userData, userSession });

  const signOutHandler = () => {
    supabase.auth.signOut();
    router.push("/");
  };
  return (
    <div className="p-20">
      <h1 className="text-5xl mb-5">Welcome {userData?.email}</h1>
      <p className="mb-5">Continue with your sign in</p>
      <div className="flex gap-5 mb-20">
        <button
          className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-white hover:border-transparent rounded"
          onClick={updateProfileAsBroker}
        >
          as Broker
        </button>
        <button className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-white hover:border-transparent rounded">
          as Client
        </button>
      </div>
      <button
        onClick={signOutHandler}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign out
      </button>
    </div>
  );
};

export default WelcomePage;
