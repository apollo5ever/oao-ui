import { useGetBalance } from "./useGetBalance";
import { useGetAddress } from "./useGetAddress";

export function useGetRole() {
  const [getBalance] = useGetBalance();
  const [getAddress] = useGetAddress();

  const getRole = async (users) => {
    const address = await getAddress();
    for (let i = 0; i < users.length; i++) {
      let balance = await getBalance(users[i].tokenName);
      if (users[i].addressName == address) {
        balance = 1;
      }
      if (balance > 0) {
        return users[i];
      }
    }
  };
  return [getRole];
}
