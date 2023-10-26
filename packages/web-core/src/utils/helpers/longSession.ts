export const setLongSession = (value: string | undefined) => {
  if (["", undefined].includes(value)) {
    return;
  }
  if (localStorage) {
    localStorage.setItem("cboSessionToken", value as string);
  } else {
    console.error("No Local Storage available");
  }
};

export const getLongSession = () => {
  if (localStorage) {
    return localStorage.getItem("cboSessionToken") ?? "";
  }
  console.error("No Local Storage available");
  return "";
};

export const deleteLongSession = () => {
  if (localStorage) {
    return localStorage.removeItem("cboSessionToken");
  } else {
    console.error("No Local Storage available");
  }
};
