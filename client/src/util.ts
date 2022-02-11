import { notification } from "antd";

export const authToken = () => localStorage.getItem("jwt_token");

export const toBase64 = (file: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// todo: add some info | success | warning
export const openNotification = (message: any, type = "success") => {
  if (type === "success") {
    notification.success({
      message,
      placement: "bottomRight",
    });
  } else if (type === "error") {
    notification.error({
      message,
      placement: "bottomRight",
    });
  }
};
