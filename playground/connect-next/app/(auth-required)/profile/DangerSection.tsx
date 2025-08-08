import { deleteUser, signOut } from "aws-amplify/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const DangerSection = () => {
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.push("/login");
  };

  const deleteAccount = async () => {
    await deleteUser();
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 mr-2">
          Log the user out on this device.
        </div>
        <Button onClick={logout} className="px-6 ">
          Logout
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 mr-2">Delete this user.</div>
        <Button onClick={deleteAccount} variant="destructive" className="px-6">
          Delete account
        </Button>
      </div>
    </div>
  );
};

export default DangerSection;
