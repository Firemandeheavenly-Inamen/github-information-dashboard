import Auth from "./components/auth";
import Dashboard from "./components/dashboard";
import { useUserContext } from "./context/userContext";

function App() {
  const { user } = useUserContext();

  return (
    <div className="App">
       {user && <Dashboard />}
     {!user && <Auth />}
      
    </div>
  );
}

export default App;
