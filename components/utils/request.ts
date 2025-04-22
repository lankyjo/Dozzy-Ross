import axiosInstance from "./axiosInstance";

export async function login({ values }: { values: LoginFormValues }) {
  const response = await axiosInstance.post("auth/login", values);
  return response;
}

export async function logoutUser() {
  const response = await axiosInstance.delete("auth/logout");
  return response;
}

export async function register({ data }: { data: RegisterFormValues }) {
  const response = await axiosInstance.post("auth/register", data);
  return response;
}

export async function postToEmail({ values }: { values: PostToEmailProps }) {
  const response = await axiosInstance.post(values.url, {
    email: values.email,
  });
  return response;
}

export async function resetPassword({ values }: { values: NewPasswordProps }) {
  const response = await axiosInstance.post("auth/reset-password", values);
  return response;
}

export async function verifyEmailOTP({ values }: { values: OTPValues }) {
  const reg = {
    email: values.email,
    code: values.code,
  };
  const reset = {
    email: values.email,
    code: values.code,
    type: values.type,
  };
  const response = await axiosInstance.post(
    values.url,
    values.type ? reset : reg
  );
  return response;
}

export async function closeAccount({ reason }: { reason: string }) {
  const response = await axiosInstance.post("user/close-account", {
    reason,
  });
  return response;
}

async function getter(url: string) {
  const response = await axiosInstance.get(url);
  return response;
}
export const getterFetcher = (url: string) => getter(url);

async function wishlistGetter(url: string) {
  if (url) {
    const { data } = await axiosInstance.get(url);
    return data;
  }
}
export const wishlistGetterFetcher = (url: string) => wishlistGetter(url);

export async function patchFunc<DataProps>({
  values,
  url,
}: {
  values: DataProps;
  url: string;
}) {
  const response = await axiosInstance.patch(url, values);
  return response;
}

export async function postFunc<DataProps>({
  values,
  url,
}: {
  values: DataProps;
  url: string;
}) {
  const response = await axiosInstance.post(url, values);
  return response;
}

export async function deleteFunc<DataProps>({
  url,
  values,
}: {
  url: string;
  values: DataProps;
}) {
  const response = await axiosInstance.delete(url, {
    data: values,
  });
  return response;
}

export const processData = (data: any[]) => {
  const result = data?.reduce(
    (
      acc: {
        _id: any; // Replace with the actual user ID
        name: any;
        items: { itemName: any; image: any; amount: any }[];
        itemCount: number;
        total: any;
        email: any;
      }[],
      item: { _id: any; user: any; name: any; image: any; price: any }
    ) => {
      const { _id, user, name, image, price } = item;

      const userIndex = acc.findIndex(
        (u: { name: any }) => u?.name === user?.username
      );

      const itemData = {
        id: crypto.randomUUID(),
        itemName: name,
        image: image,
        amount: price,
      };

      if (userIndex >= 0) {
        acc[userIndex].items?.push(itemData);
        acc[userIndex].itemCount += 1;
        acc[userIndex].total += price;
      } else {
        acc.push({
          _id: _id,
          name: user?.username,
          items: [itemData],
          itemCount: 1,
          total: price,
          email: user?.email || "default@example.com",
        });
      }

      return acc;
    },
    []
  );

  return result;
};

export async function urlToFile(url: string, filename: string) {
  const response = await fetch(url);

  const blob = await response.blob();
  // return new File([blob], filename, { type: blob.type });
  return new File([blob], filename, { type: blob.type });
}

export async function getterImage(url: string) {
  const response = await axiosInstance.get(url, { responseType: "blob" });
  return response;
}

export const postLocations = async ({
  values,
  url,
}: {
  values: any[];
  url: string;
}) => {
  const apiCalls = values.map((data) =>
    postFunc({
      values: data,
      url: url,
    })
  );

  const results = await Promise.all(apiCalls);

  return results;
};

// Example usage:
