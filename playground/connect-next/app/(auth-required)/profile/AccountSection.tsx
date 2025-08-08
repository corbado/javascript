import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CognitoUserInfo, getCognitoUserInfo } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { updateUserAttribute, confirmUserAttribute } from "aws-amplify/auth";
import { ConfirmOTP } from "@/components/ConfirmOTP";

export const AccountSection = () => {
  const [userInfo, setUserInfo] = useState<CognitoUserInfo | undefined>();
  const [editMode, setEditMode] = useState(false);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const userInfo = await getCognitoUserInfo();
        setUserInfo(userInfo);
        setPhone(userInfo.phoneNumber || "");
      } catch {
        setMessage("Failed to load user info");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
    setMessage(null);
    setPhone(userInfo?.phoneNumber || "");
  };

  const handleCancel = () => {
    setEditMode(false);
    setVerificationRequired(false);
    setMessage(null);
    setPhone(userInfo?.phoneNumber || "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const output = await updateUserAttribute({
        userAttribute: { attributeKey: "phone_number", value: phone },
      });
      if (
        output.nextStep &&
        output.nextStep.updateAttributeStep === "CONFIRM_ATTRIBUTE_WITH_CODE"
      ) {
        setVerificationRequired(true);
        setMessage(
          `A verification code was sent to your new phone number. Please enter it below.`
        );
      } else {
        setMessage("Phone number updated successfully.");
        setEditMode(false);
        setUserInfo((prev) => prev && { ...prev, phoneNumber: phone });
      }
    } catch {
      setMessage("Failed to update phone number.");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyOTP = async (code: string): Promise<string | undefined> => {
    setMessage(null);
    try {
      await confirmUserAttribute({
        userAttributeKey: "phone_number",
        confirmationCode: code,
      });
      setMessage("Phone number verified and updated successfully.");
      setEditMode(false);
      setVerificationRequired(false);
      setUserInfo((prev) => prev && { ...prev, phoneNumber: phone });
      return undefined;
    } catch {
      return "Failed to verify phone number. Please check the code and try again.";
    }
  };

  if (loading) {
    return <Skeleton className="h-[190px]" />;
  }

  const profileData = {
    Username: userInfo?.username,
    Email: userInfo?.email,
    "Phone Number": userInfo?.phoneNumber,
    "Email Verified": userInfo?.emailVerified?.toString(),
  };

  return (
    <div className="grid grid-cols-1 gap-4 text-sm">
      {Object.entries(profileData).map(([label, value]) => (
        <div key={label}>
          <div className="font-medium text-gray-600">{label}</div>
          <div className="text-gray-900 break-words">
            {label === "Phone Number" && editMode ? (
              <input
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
            ) : (
              value || "-"
            )}
          </div>
        </div>
      ))}
      {editMode ? (
        verificationRequired ? (
          <div className="flex flex-col gap-2 mt-2">
            <ConfirmOTP onSubmit={handleVerifyOTP} onCancel={handleCancel} />
            {message && (
              <div className="text-sm mt-2 text-gray-600">{message}</div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
            {message && (
              <div className="text-sm mt-2 text-gray-600">{message}</div>
            )}
          </form>
        )
      ) : (
        <div className="w-full flex justify-end">
          <Button className="mt-4 w-fit " onClick={handleEdit}>
            Edit Account
          </Button>
        </div>
      )}
      {!editMode && message && (
        <div className="text-sm mt-2 text-gray-600 text-right">{message}</div>
      )}
    </div>
  );
};
