import { Router } from "./Router";
import { UserProvider } from "./contexts/UserContext";

export function App() {
  return (
    <UserProvider>
      <Router />
    </UserProvider>
  );
}
