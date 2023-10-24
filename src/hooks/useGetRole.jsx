import { useGetBalance } from "./useGetBalance";

export function useGetRole() {
  const [getBalance] = useGetBalance();

  const getRole = async (users) => {
    for (let i = 0; i < users.length; i++) {
      let balance = await getBalance(users[i].tokenName);
      if (balance > 0) {
        return users[i];
      }
    }
  };
  return [getRole];
}
